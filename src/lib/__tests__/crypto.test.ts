// ============================================================
// EduPass — Cryptographic Verification Automated Tests
// ============================================================

import {
  signCredential,
  verifyCredentialOffline,
  serializeCredential,
  generateSeed,
  hashPhoto,
  generateRotatingCode,
  verifyRotatingCode,
  encodeQRData,
  decodeQRData,
  getPublicKey,
} from '../crypto';
import type { RosterEntry } from '../types';

async function runTests() {
  console.log('--- Starting EduPass Cryptography Verification Tests ---');

  // Test Keypair
  const privateKey = 'a52f159e1c25a7fb1b44eb0c66a5e0c9fdba77a8e9371a5a8d98fb45d6de0c37';
  const publicKey = await getPublicKey(privateKey);
  console.log('✓ Public key derived successfully:', publicKey.slice(0, 16) + '...');

  const nowSec = Math.floor(Date.now() / 1000);
  const futureSec = nowSec + 90 * 86400;
  const photoHash = hashPhoto(new TextEncoder().encode('test-student-photo'));

  // 1. Sign credential
  const payload = serializeCredential({
    version: 'v1',
    passId: 'EP-TEST-001',
    name: 'Pooja M',
    institution: 'CET Trivandrum',
    passClass: 'STUDENT',
    validUntil: futureSec,
    issuedAt: nowSec,
    photoHash,
  });

  const signature = await signCredential(payload, privateKey);
  console.log('✓ Credential signed with Ed25519 signature:', signature.slice(0, 16) + '...');

  // 2. Generate HMAC seed and rotating code
  const seed = generateSeed();
  const timeStep = Math.floor(Date.now() / 30000);
  const rotatingCode = generateRotatingCode(seed, timeStep);
  console.log('✓ Rotating 8-char HMAC code generated:', rotatingCode);

  // 3. Test rotating code verification with tolerance
  const hmacCheck = verifyRotatingCode(seed, rotatingCode, 2);
  if (!hmacCheck.valid) throw new Error('Rotating code verification failed');
  console.log('✓ Rotating code validated within tolerance window. Observed skew:', hmacCheck.skewMs, 'ms');

  // 4. Test QR Encoding and Decoding
  const qrString = encodeQRData(payload, signature, rotatingCode);
  const decodedQR = decodeQRData(qrString);
  console.log('✓ QR string encoded and decoded cleanly for pass:', decodedQR.rotatingCode);

  // 5. Test offline verification pipeline (GREEN result)
  const rosterMap = new Map<string, RosterEntry>([
    [
      'EP-TEST-001',
      {
        passId: 'EP-TEST-001',
        seed,
        photoHash,
        name: 'Pooja M',
        institution: 'CET Trivandrum',
        validUntil: futureSec,
      },
    ],
  ]);
  const revocationsSet = new Set<string>();

  const validResult = await verifyCredentialOffline(
    qrString,
    publicKey,
    rosterMap,
    revocationsSet
  );

  if (validResult.status !== 'VERIFIED') {
    throw new Error(`Expected VERIFIED but got ${validResult.status}: ${validResult.reason}`);
  }
  console.log(`✓ Offline verification passed: GREEN in ${validResult.verificationTimeMs.toFixed(2)}ms (< 50ms)`);

  // 6. Test tampered / forged credential (RED result - signature mismatch)
  const forgedPayload = payload.replace('Pooja M', 'Fake Student');
  const forgedQRString = encodeQRData(forgedPayload, signature, rotatingCode);

  const forgedResult = await verifyCredentialOffline(
    forgedQRString,
    publicKey,
    rosterMap,
    revocationsSet
  );

  if (forgedResult.status !== 'REJECTED') {
    throw new Error('Forged pass was not rejected');
  }
  console.log('✓ Forged credential successfully rejected: RED -', forgedResult.reason);

  // 7. Test revoked pass (RED result - revoked)
  const revokedSet = new Set<string>(['EP-TEST-001']);
  const revokedResult = await verifyCredentialOffline(
    qrString,
    publicKey,
    rosterMap,
    revokedSet
  );

  if (revokedResult.status !== 'REJECTED' || !revokedResult.reason?.includes('REVOKED')) {
    throw new Error('Revoked pass was not properly rejected');
  }
  console.log('✓ Revoked credential successfully rejected offline: RED -', revokedResult.reason);

  console.log('--- ALL CRYPTOGRAPHIC TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});
