// ============================================================
// EduPass — System Operations & Cryptographic Verification Console
// Styled with Fraunces & Montserrat in warm studio beige
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  CreditCard,
  ShieldAlert,
  ClipboardCheck,
  Wifi,
  WifiOff,
  Clock,
  Fingerprint,
  Shield,
  ArrowRight,
  Database,
  Cloud,
  Lock,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';
import Header from '../components/Header';
import { SUPABASE_URL } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';

const features = [
  { icon: WifiOff, label: 'Zero-Network Autonomy', desc: 'Verifies offline in airplane mode' },
  { icon: Clock, label: '< 5ms Speed', desc: 'Ed25519 asymmetric verification' },
  { icon: Fingerprint, label: 'Touchless Workflow', desc: 'Instant camera optical scan' },
  { icon: Shield, label: 'Cryptographic Security', desc: 'Mathematical tamper prevention' },
];

const operations = [
  {
    to: '/student/pass',
    icon: CreditCard,
    title: 'Active Student Digital Pass',
    desc: 'Inspect a live cryptographic credential featuring a 30s rotating HMAC token',
    badge: 'STUDENT IDENTITY',
  },
  {
    to: '/conductor/scan',
    icon: ScanLine,
    title: 'On-Bus Conductor Terminal',
    desc: 'Perform high-speed offline verification using the camera — zero network calls',
    badge: 'CONDUCTOR TERMINAL',
  },
  {
    to: '/review/forged',
    icon: ShieldAlert,
    title: 'Tampered Pass Security Audit',
    desc: 'Scan an altered credential to confirm Ed25519 digital signature mismatch rejection',
    badge: 'CRYPTOGRAPHIC AUDIT',
  },
  {
    to: '/admin/applications',
    icon: ClipboardCheck,
    title: 'Depot Concession Approval',
    desc: 'Audit student proofs, generate Ed25519 signature, and issue credentials',
    badge: 'TRANSPORT OPERATIONS',
  },
];

export default function Review() {
  const { profile } = useAuth();
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sampleSqlSnippet = `-- EduPass Complete PostgreSQL Database Schema
-- Run in Supabase SQL Editor:
-- Tables: applications, passes, roster, revocations, scan_logs, profiles
-- Storage: 'concession-proofs' bucket
-- Full file located in supabase/schema.sql`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0ECE3] border border-[#E5E0D6] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#18181B] animate-pulse" />
            <span className="text-[11px] font-sans font-semibold text-[#6E6D66] tracking-wide">
              Operations & Verification Console
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#18181B] tracking-tight leading-[1.1] mb-3">
            System Operational Console
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#6E6D66] leading-relaxed">
            Verify real-time cryptographic pass validation, conductor offline terminal performance,
            and state cloud database synchronization.
          </p>
        </div>

        {/* Live System Infrastructure Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-sm mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D6]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-base text-[#18181B]">
                  Supabase Cloud Infrastructure Live
                </h3>
                <p className="font-mono text-xs text-[#6E6D66]">
                  Cluster ID: {SUPABASE_URL.replace('https://', '').split('.')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#F5F1E9] hover:bg-[#EAE5DA] text-[#18181B] border border-[#E5E0D6] transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#6E6D66]" />
                <span>Switch Persona / Auth</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-sans">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
              <div className="flex items-center gap-2 text-[#23533D] font-bold mb-1">
                <Database className="w-4 h-4" />
                <span>PostgreSQL Database</span>
              </div>
              <p className="text-[11px] text-[#6E6D66]">
                Applications, passes, roster cache, and scan ledger
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
              <div className="flex items-center gap-2 text-[#23533D] font-bold mb-1">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>Cloud Storage</span>
              </div>
              <p className="text-[11px] text-[#6E6D66]">
                Bucket: <code>concession-proofs</code> (Photos & ID proof)
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
              <div className="flex items-center gap-2 text-[#23533D] font-bold mb-1">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Active Stakeholder</span>
              </div>
              <p className="text-[11px] text-[#6E6D66]">
                Role: <strong className="uppercase text-[#18181B]">{profile?.role || 'Guest'}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Primary Operations Deck */}
        <div className="space-y-3.5 mb-10">
          <h2 className="font-display font-bold text-xl text-[#18181B] mb-2">
            Operational Verification Terminals
          </h2>

          {operations.map((op, idx) => (
            <motion.div
              key={op.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
            >
              <Link
                to={op.to}
                className="group flex items-center justify-between p-5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#18181B] hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <op.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-[#18181B] group-hover:text-[#23533D] transition-colors">
                        {op.title}
                      </h3>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5F1E9] text-[#6E6D66]">
                        {op.badge}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#6E6D66] mt-1 leading-relaxed">
                      {op.desc}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#6E6D66] group-hover:bg-[#18181B] group-hover:text-white transition-colors shrink-0 ml-4">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Airplane Mode Guide Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] mb-10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F0ECE3] border border-[#E5E0D6] flex items-center justify-center text-[#B47828] shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#18181B] mb-1">
                Autonomous Offline Verification Procedure
              </h3>
              <p className="font-sans text-xs text-[#6E6D66] leading-relaxed mb-3">
                To test zero-network verification on a mobile handset or workstation:
              </p>
              <ol className="font-sans text-xs text-[#6E6D66] space-y-1.5 list-decimal list-inside">
                <li>
                  Open the <Link to="/conductor" className="font-bold underline text-[#18181B]">Conductor Sync Hub</Link> once while connected to cache the roster.
                </li>
                <li>
                  Toggle your device into <strong>Airplane Mode</strong> (turn off Wi-Fi and Cellular).
                </li>
                <li>
                  Open the <Link to="/conductor/scan" className="font-bold underline text-[#18181B]">Conductor Scanner</Link> and scan any active pass.
                </li>
                <li>
                  The credential verifies in <strong>&lt; 5 milliseconds</strong> with full cryptographic certainty.
                </li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {features.map((f) => (
            <div
              key={f.label}
              className="p-4 bg-white rounded-xl border border-[#E5E0D6] text-center"
            >
              <f.icon className="w-5 h-5 text-[#18181B] mx-auto mb-2" />
              <div className="font-sans font-bold text-xs text-[#18181B]">{f.label}</div>
              <div className="font-sans text-[10px] text-[#6E6D66] mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Additional Test Scenarios */}
        <div className="space-y-3 mb-10">
          <h3 className="font-display font-bold text-base text-[#18181B]">
            Cryptographic Failure Benchmarks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/review/expired"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E0D6] hover:border-rose-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-sans font-bold text-xs text-[#18181B]">Expired Credential</div>
                <div className="font-sans text-[11px] text-[#6E6D66]">
                  Rejects when timestamp is past validity window
                </div>
              </div>
            </Link>

            <Link
              to="/review/revoked"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E0D6] hover:border-rose-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="font-sans font-bold text-xs text-[#18181B]">Revoked Credential</div>
                <div className="font-sans text-[11px] text-[#6E6D66]">
                  Evaluates against offline cached revocation blacklist
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Architecture & SQL Drawer */}
        <div className="p-6 bg-white rounded-xl border border-[#E5E0D6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-base text-[#18181B]">
              PostgreSQL Database Schema
            </h4>
            <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
              Production schema covering applications, credentials, roster cache, and scan ledger.
            </p>
          </div>

          <button
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-[#2B2B30] transition-colors shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>View SQL Schema</span>
          </button>
        </div>
      </main>

      {/* SQL Modal */}
      <AnimatePresence>
        {showSqlModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#E5E0D6]"
            >
              <div className="p-4 bg-[#18181B] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-display font-bold text-sm">Supabase PostgreSQL Schema</span>
                </div>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="text-white/60 hover:text-white font-mono text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 font-mono text-xs bg-[#1E1E22] text-[#E5E0D6]">
                <p className="text-stone-400 font-sans text-xs mb-3">
                  This schema is located at <code>supabase/schema.sql</code> and defines the state
                  concession data models and access policies:
                </p>
                <pre className="p-4 bg-[#141416] rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                  {`-- 1. applications
CREATE TABLE public.applications (
  id text PRIMARY KEY,
  student_name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  institution text NOT NULL,
  enrolment_no text NOT NULL,
  course text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  route_class text NOT NULL DEFAULT 'STUDENT',
  status text NOT NULL DEFAULT 'PENDING',
  photo_url text,
  proof_url text,
  student_id_url text,
  submitted_at timestamptz DEFAULT now()
);

-- 2. passes
CREATE TABLE public.passes (
  id text PRIMARY KEY,
  pass_id text UNIQUE NOT NULL,
  student_name text NOT NULL,
  institution text NOT NULL,
  route_class text NOT NULL,
  valid_from bigint NOT NULL,
  valid_until bigint NOT NULL,
  photo_hash text NOT NULL,
  hmac_seed text NOT NULL,
  ed25519_signature text NOT NULL,
  canonical_payload text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE'
);

-- 3. roster & scan_logs
CREATE TABLE public.roster (...);
CREATE TABLE public.scan_logs (...);
-- Storage Bucket: concession-proofs (public)`}
                </pre>
              </div>

              <div className="p-4 bg-[#FAF7F2] border-t border-[#E5E0D6] flex items-center justify-between">
                <span className="text-xs text-[#6E6D66] font-mono">
                  Target: {SUPABASE_URL}
                </span>
                <button
                  onClick={copySqlToClipboard}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-sans font-bold hover:bg-[#2B2B30] transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
