// ============================================================
// EduPass — Supabase Client & Cloud Sync Layer
// ============================================================
// Handles:
// 1. Supabase Client Initialization
// 2. Storage Uploads for Student ID, Proof, and Photo
// 3. Database CRUD (applications, passes, roster, scan_logs)
// 4. Offline/Fallback resilience (never crashes if tables unmigrated or offline)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import type { StudentApplication, Pass, RosterEntry, ScanLog } from './types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://xsuwqqxskcmldmpqylhm.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdXdxcXhza2NtbGRtcHF5bGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4ODU0NzIsImV4cCI6MjEwNTQ2MTQ3Mn0.QrKdvXkS7eTgKdOjKYsMyAcp3bzqTEfB0Z3tq6Y28EU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseHealth {
  connected: boolean;
  storageOk: boolean;
  databaseOk: boolean;
  message: string;
}

let _healthCache: SupabaseHealth | null = null;
let _lastHealthCheck = 0;

/** Check Supabase status: connection, storage bucket, and table presence */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const now = Date.now();
  if (_healthCache && now - _lastHealthCheck < 30000) {
    return _healthCache;
  }

  try {
    // 1. Check storage
    const { data: buckets, error: storageErr } = await supabase.storage.listBuckets();
    const storageOk = !storageErr && !!buckets;

    // 2. Check database tables
    const { error: dbErr } = await supabase.from('applications').select('id').limit(1);
    const databaseOk = !dbErr || (dbErr.code !== 'PGRST205' && dbErr.code !== '42P01');

    const result: SupabaseHealth = {
      connected: true,
      storageOk,
      databaseOk,
      message: databaseOk
        ? 'Supabase Database & Storage Live'
        : 'Storage Active — PostgreSQL schema ready for 1-click execution',
    };
    _healthCache = result;
    _lastHealthCheck = now;
    return result;
  } catch (e) {
    const fallback: SupabaseHealth = {
      connected: false,
      storageOk: false,
      databaseOk: false,
      message: e instanceof Error ? e.message : 'Network offline / connection issue',
    };
    _healthCache = fallback;
    return fallback;
  }
}

// ── Storage Helpers ──────────────────────────────────────────

/**
 * Upload a document or photo to Supabase Storage 'concession-proofs'
 * Returns the public URL, or falls back to local data URI if network fails.
 */
export async function uploadToSupabaseStorage(
  file: File,
  folder = 'documents'
): Promise<string> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const cleanName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('concession-proofs')
      .upload(cleanName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error, using fallback DataURL:', error.message);
      return fileToDataUrl(file);
    }

    if (data?.path) {
      const { data: urlData } = supabase.storage
        .from('concession-proofs')
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    }
  } catch (err) {
    console.warn('Storage upload caught error, fallback to DataURL:', err);
  }

  return fileToDataUrl(file);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
}

// ── Database Operations with Graceful Offline Fallback ───────

/** Push an application to Supabase database if online & table exists */
export async function syncApplicationToSupabase(
  app: StudentApplication
): Promise<boolean> {
  try {
    const { error } = await supabase.from('applications').upsert({
      id: app.id,
      student_name: app.name,
      email: app.email,
      mobile: app.mobile,
      institution: app.institution,
      enrolment_no: app.enrolmentNo,
      course: app.course,
      department: app.department,
      year: app.year,
      origin: app.origin,
      destination: app.destination,
      route_class: app.routeClass,
      transport_operator: app.transportOperator,
      status: app.status,
      photo_url: app.photoUrl,
      proof_url: app.proofUrl,
      student_id_url: app.studentIdUrl,
      submitted_at: new Date(app.submittedAt * 1000).toISOString(),
    });

    if (error) {
      console.warn('Supabase application sync notice:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Update application status in Supabase */
export async function updateApplicationInSupabase(
  id: string,
  updates: Partial<StudentApplication>
): Promise<boolean> {
  try {
    const updatePayload: Record<string, unknown> = {};
    if (updates.status) updatePayload.status = updates.status;
    if (updates.approvedAt) updatePayload.reviewed_at = new Date(updates.approvedAt * 1000).toISOString();

    const { error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

/** Push a newly issued pass to Supabase */
export async function syncPassToSupabase(pass: Pass): Promise<boolean> {
  try {
    const { error } = await supabase.from('passes').upsert({
      id: pass.id,
      pass_id: pass.id,
      student_name: pass.name,
      institution: pass.institution,
      route_class: pass.passClass,
      valid_from: pass.issuedAt,
      valid_until: pass.validUntil,
      photo_hash: pass.photoHash,
      hmac_seed: pass.seed,
      ed25519_signature: pass.signature,
      canonical_payload: pass.credential,
      status: pass.revoked ? 'REVOKED' : 'ACTIVE',
      issued_at: new Date(pass.issuedAt * 1000).toISOString(),
    });

    // Also sync to roster table for conductor sync
    await supabase.from('roster').upsert({
      pass_id: pass.id,
      student_name: pass.name,
      institution: pass.institution,
      route_class: pass.passClass,
      valid_until: pass.validUntil,
      photo_hash: pass.photoHash,
      hmac_seed: pass.seed,
    });

    return !error;
  } catch {
    return false;
  }
}

/** Sync offline scan logs from Conductor to Supabase */
export async function syncScanLogToSupabase(log: ScanLog): Promise<boolean> {
  try {
    const { error } = await supabase.from('scan_logs').upsert({
      id: log.id,
      pass_id: log.passId,
      device_id: log.deviceId,
      scan_time: new Date(log.timestamp).toISOString(),
      result: log.result,
      reason: log.reason || null,
      verification_mode: log.verificationMode,
      verification_time_ms: log.verificationTimeMs,
      observed_skew_ms: log.observedSkewMs,
      sync_id: log.syncId,
    });

    return !error;
  } catch {
    return false;
  }
}

/** Fetch all passes from Supabase or return empty array if offline */
export async function fetchPassesFromSupabase(): Promise<Pass[]> {
  try {
    const { data, error } = await supabase.from('passes').select('*');
    if (error || !data) return [];
    return data.map((row) => ({
      id: row.pass_id || row.id,
      studentId: row.pass_id || row.id,
      credential: row.canonical_payload || '',
      signature: row.ed25519_signature || '',
      seed: row.hmac_seed || '',
      validUntil: Number(row.valid_until),
      issuedAt: Number(row.valid_from || 0),
      revoked: row.status === 'REVOKED',
      photoHash: row.photo_hash || '',
      photoUrl: '',
      name: row.student_name,
      institution: row.institution,
      passClass: row.route_class || 'STUDENT',
      enrolmentNo: '',
    }));
  } catch {
    return [];
  }
}

/** Fetch roster entries from Supabase */
export async function fetchRosterFromSupabase(): Promise<RosterEntry[]> {
  try {
    const { data, error } = await supabase.from('roster').select('*');
    if (error || !data) return [];
    return data.map((row) => ({
      passId: row.pass_id,
      seed: row.hmac_seed,
      photoHash: row.photo_hash,
      name: row.student_name,
      institution: row.institution,
      validUntil: Number(row.valid_until),
    }));
  } catch {
    return [];
  }
}
