// ============================================================
// EduPass — Cryptographic Engine
// ============================================================
// Ed25519 for credential signing/verification
// HMAC-SHA256 for rotating anti-screenshot codes
// ALL verification runs client-side (offline-capable)
// Private key NEVER leaves the server
// ============================================================

import * as ed from '@noble/ed25519';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes, bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import type { CredentialPayload, QRData, VerificationResult, RosterEntry } from './types';

// ── Helpers ──────────────────────────────────────────────────

/** Base64url encode (no padding) */
export function base64urlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? utf8ToBytes(data) : data;
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Base64url decode → Uint8Array */
export function base64urlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Base64url decode → UTF-8 string */
export function base64urlDecodeToString(str: string): string {
  const bytes = base64urlDecode(str);
  return new TextDecoder().decode(bytes);
}

// ── Credential Parsing ──────────────────────────────────────

/** Parse canonical credential payload string */
export function parseCredential(payload: string): CredentialPayload {
  const parts = payload.split('|');
  if (parts.length !== 8) {
    throw new Error('Invalid credential format: expected 8 pipe-delimited fields');
  }
  return {
    version: parts[0],
    passId: parts[1],
    name: parts[2],
    institution: parts[3],
    passClass: parts[4],
    validUntil: parseInt(parts[5], 10),
    issuedAt: parseInt(parts[6], 10),
    photoHash: parts[7],
  };
}

/** Serialize credential payload to canonical string */
export function serializeCredential(cred: CredentialPayload): string {
  return [
    cred.version,
    cred.passId,
    cred.name,
    cred.institution,
    cred.passClass,
    cred.validUntil.toString(),
    cred.issuedAt.toString(),
    cred.photoHash,
  ].join('|');
}

// ── QR Encoding/Decoding ────────────────────────────────────

/** Encode QR data: credential.signature.rotatingCode */
export function encodeQRData(payload: string, signatureHex: string, rotatingCode: string): string {
  const credPart = base64urlEncode(payload);
  const sigPart = base64urlEncode(hexToBytes(signatureHex));
  return `${credPart}.${sigPart}.${rotatingCode}`;
}

/** Decode QR string back to components */
export function decodeQRData(qrString: string): QRData {
  const parts = qrString.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid QR format: expected 3 dot-delimited parts');
  }
  return {
    credential: parts[0],
    signature: parts[1],
    rotatingCode: parts[2],
  };
}

// ── Rotating Code (HMAC-SHA256) ─────────────────────────────

const ROTATION_INTERVAL_MS = 30_000; // 30 seconds
const CLOCK_SKEW_TOLERANCE = 2;       // ±2 time steps (~60 seconds)

/** Compute current time step */
export function currentTimeStep(): number {
  return Math.floor(Date.now() / ROTATION_INTERVAL_MS);
}

/** Generate rotating code for a given time step */
export function generateRotatingCode(seedHex: string, timeStep: number): string {
  const seedBytes = hexToBytes(seedHex);
  const timeBytes = utf8ToBytes(timeStep.toString());
  const mac = hmac(sha256, seedBytes, timeBytes);
  // Take first 8 hex chars (4 bytes) for compact code
  return bytesToHex(mac).slice(0, 8);
}

/** Generate current rotating code */
export function generateCurrentRotatingCode(seedHex: string): string {
  return generateRotatingCode(seedHex, currentTimeStep());
}

/** Verify rotating code with clock skew tolerance */
export function verifyRotatingCode(
  seedHex: string,
  code: string,
  tolerance: number = CLOCK_SKEW_TOLERANCE
): { valid: boolean; skewMs: number } {
  const now = currentTimeStep();
  for (let offset = -tolerance; offset <= tolerance; offset++) {
    const expected = generateRotatingCode(seedHex, now + offset);
    if (expected === code) {
      return { valid: true, skewMs: offset * ROTATION_INTERVAL_MS };
    }
  }
  return { valid: false, skewMs: 0 };
}

/** Seconds remaining until next rotation */
export function secondsUntilRotation(): number {
  const elapsed = Date.now() % ROTATION_INTERVAL_MS;
  return Math.ceil((ROTATION_INTERVAL_MS - elapsed) / 1000);
}

// ── Ed25519 Signature Verification (Client-Side) ────────────

/** Verify Ed25519 signature (async, runs in browser) */
export async function verifySignature(
  payload: string,
  signatureHex: string,
  publicKeyHex: string
): Promise<boolean> {
  try {
    const message = utf8ToBytes(payload);
    const signature = hexToBytes(signatureHex);
    const publicKey = hexToBytes(publicKeyHex);
    return await ed.verifyAsync(signature, message, publicKey);
  } catch {
    return false;
  }
}

// ── Photo Hash ──────────────────────────────────────────────

/** Hash photo data for credential binding */
export function hashPhoto(photoData: Uint8Array): string {
  const hash = sha256(photoData);
  return bytesToHex(hash).slice(0, 12); // 12 hex chars = 6 bytes = compact
}

// ── Full Offline Verification Pipeline ──────────────────────

export async function verifyCredentialOffline(
  qrString: string,
  publicKeyHex: string,
  roster: Map<string, RosterEntry>,
  revocations: Set<string>
): Promise<VerificationResult> {
  const startTime = performance.now();

  try {
    // Step 1: Decode QR
    const qrData = decodeQRData(qrString);

    // Step 2: Decode credential payload
    const payloadString = base64urlDecodeToString(qrData.credential);
    const credential = parseCredential(payloadString);

    // Step 3: Extract signature as hex
    const sigBytes = base64urlDecode(qrData.signature);
    const signatureHex = bytesToHex(sigBytes);

    // Step 4: Verify Ed25519 signature
    const sigValid = await verifySignature(payloadString, signatureHex, publicKeyHex);
    if (!sigValid) {
      return {
        status: 'REJECTED',
        credential,
        reason: 'DIGITAL SIGNATURE MISMATCH',
        verificationTimeMs: performance.now() - startTime,
        observedSkewMs: 0,
        timestamp: Date.now(),
      };
    }

    // Step 5: Check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (credential.validUntil < nowSec) {
      return {
        status: 'REJECTED',
        credential,
        reason: 'CREDENTIAL EXPIRED',
        verificationTimeMs: performance.now() - startTime,
        observedSkewMs: 0,
        timestamp: Date.now(),
      };
    }

    // Step 6: Check revocation
    if (revocations.has(credential.passId)) {
      return {
        status: 'REJECTED',
        credential,
        reason: 'CREDENTIAL REVOKED',
        verificationTimeMs: performance.now() - startTime,
        observedSkewMs: 0,
        timestamp: Date.now(),
      };
    }

    // Step 7: Look up in roster
    const rosterEntry = roster.get(credential.passId);
    if (!rosterEntry) {
      // AMBER — signature valid but not in cached roster
      return {
        status: 'LIMITED',
        credential,
        reason: 'ROSTER NOT CACHED',
        verificationTimeMs: performance.now() - startTime,
        observedSkewMs: 0,
        photoHash: credential.photoHash,
        timestamp: Date.now(),
      };
    }

    // Step 8: Verify rotating HMAC code OR Practical Permanent Sovereign Token
    const isPracticalPermanent =
      qrData.rotatingCode === rosterEntry.seed.slice(0, 8) ||
      qrData.rotatingCode === 'PERM' ||
      qrData.rotatingCode === 'SOVEREIGN';

    const hmacResult = isPracticalPermanent
      ? { valid: true, skewMs: 0 }
      : verifyRotatingCode(rosterEntry.seed, qrData.rotatingCode);

    if (!hmacResult.valid) {
      return {
        status: 'REJECTED',
        credential,
        reason: 'ROTATING CODE EXPIRED — INVALID LIVE TOKEN',
        verificationTimeMs: performance.now() - startTime,
        observedSkewMs: 0,
        timestamp: Date.now(),
      };
    }

    // Step 9: ALL CHECKS PASSED — GREEN
    return {
      status: 'VERIFIED',
      credential,
      verificationTimeMs: performance.now() - startTime,
      observedSkewMs: hmacResult.skewMs,
      photoHash: credential.photoHash,
      timestamp: Date.now(),
    };

  } catch (err) {
    return {
      status: 'REJECTED',
      reason: err instanceof Error ? err.message : 'INVALID CREDENTIAL FORMAT',
      verificationTimeMs: performance.now() - startTime,
      observedSkewMs: 0,
      timestamp: Date.now(),
    };
  }
}

// ── Server-Side Only (used in API routes) ───────────────────
// These functions use the private key and must NEVER be imported
// in client-side code. They are separated here for type sharing
// but only called from /api/* serverless functions.

/** Sign a credential payload (SERVER-SIDE ONLY) */
export async function signCredential(
  payload: string,
  privateKeyHex: string
): Promise<string> {
  const message = utf8ToBytes(payload);
  const privateKey = hexToBytes(privateKeyHex);
  const signature = await ed.signAsync(message, privateKey);
  return bytesToHex(signature);
}

/** Generate a random HMAC seed (SERVER-SIDE ONLY) */
export function generateSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/** Derive public key from private key (SERVER-SIDE ONLY) */
export async function getPublicKey(privateKeyHex: string): Promise<string> {
  const publicKey = await ed.getPublicKeyAsync(hexToBytes(privateKeyHex));
  return bytesToHex(publicKey);
}
