// ============================================================
// EduPass — Conductor Scanner
// ============================================================
// Camera-based QR scanner with FULL OFFLINE verification.
// No API calls during scan — everything is local crypto.
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import VerificationResultComponent from '../../components/VerificationResult';
import OfflineIndicator from '../../components/OfflineIndicator';
import { verifyCredentialOffline } from '../../lib/crypto';
import {
  getPublicKey,
  getRosterAsMap,
  getRevocationsSet,
  addScanLog,
  getDeviceId,
  markScanSynced,
} from '../../lib/offline-store';
import { syncScanLogToSupabase } from '../../lib/supabase';
import type { VerificationResult, ScanLog } from '../../lib/types';

type ScanState = 'scanning' | 'verifying' | 'result';

export default function ConductorScan() {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [rosterReady, setRosterReady] = useState(false);

  // Load cached public key on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const pk = await getPublicKey();
        if (pk) {
          setPublicKey(pk);
          setRosterReady(true);
        }
      } catch (err) {
        console.error('Failed to load cached data:', err);
      }
    };
    loadCachedData();
  }, []);

  const handleScan = useCallback(async (qrData: string) => {
    setScanState('verifying');

    try {
      // Get cached data from IndexedDB
      const pk = publicKey || await getPublicKey();
      if (!pk) {
        setResult({
          status: 'REJECTED',
          reason: 'PUBLIC KEY NOT CACHED — Please sync roster first',
          verificationTimeMs: 0,
          observedSkewMs: 0,
          timestamp: Date.now(),
        });
        setScanState('result');
        return;
      }

      const roster = await getRosterAsMap();
      const revocations = await getRevocationsSet();

      // Run full offline verification pipeline
      const verificationResult = await verifyCredentialOffline(
        qrData,
        pk,
        roster,
        revocations
      );

      setResult(verificationResult);

      // Store scan log in IndexedDB
      const deviceId = await getDeviceId();
      const scanLog: ScanLog = {
        id: crypto.randomUUID(),
        passId: verificationResult.credential?.passId || 'UNKNOWN',
        deviceId,
        timestamp: Date.now(),
        result: verificationResult.status,
        reason: verificationResult.reason,
        verificationMode: navigator.onLine ? 'ONLINE' : 'OFFLINE',
        verificationTimeMs: verificationResult.verificationTimeMs,
        observedSkewMs: verificationResult.observedSkewMs,
        syncStatus: 'PENDING',
        syncId: crypto.randomUUID(),
      };

      await addScanLog(scanLog);

      if (navigator.onLine) {
        syncScanLogToSupabase(scanLog).then((ok) => {
          if (ok) markScanSynced(scanLog.id);
        }).catch(() => {});
      }

    } catch (err) {
      setResult({
        status: 'REJECTED',
        reason: err instanceof Error ? err.message : 'Verification failed',
        verificationTimeMs: 0,
        observedSkewMs: 0,
        timestamp: Date.now(),
      });
    }

    setScanState('result');
  }, [publicKey]);

  const handleScanAgain = useCallback(() => {
    setResult(null);
    setScanState('scanning');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E5E0D6]">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/conductor"
              className="p-2 -ml-2 hover:bg-[#F0ECE3] rounded-lg transition-colors text-[#18181B]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-base text-[#18181B] leading-tight">
                Conductor Verification Terminal
              </h1>
              <p className="font-sans text-[10px] text-[#6E6D66]">
                Offline Asymmetric Scanner · Ed25519
              </p>
            </div>
          </div>
          <OfflineIndicator />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 w-full flex-1">
        {/* Public key status */}
        {!rosterReady && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <p className="font-sans text-xs font-semibold text-[#8E4B10]">
              ⚠ Roster not cached. Visit{' '}
              <Link to="/conductor" className="underline font-bold text-[#18181B]">Conductor Hub</Link>
              {' '}to download the roster. The scanner will still cryptographically verify Ed25519 signatures.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* SCANNING STATE */}
          {scanState === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QRScanner onScan={handleScan} active={scanState === 'scanning'} />

              {/* Instructions */}
              <div className="mt-6 p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#23533D]" />
                  <h3 className="font-sans font-bold text-xs text-[#18181B] uppercase tracking-wider">
                    Zero-Network Cryptographic Scanner Active
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#6E6D66] leading-relaxed">
                  Position camera over the student's dynamic QR code. Verification executes purely in memory
                  using the locally cached Ed25519 public key and HMAC rotating seed — 100% offline.
                </p>
              </div>
            </motion.div>
          )}

          {/* VERIFYING STATE */}
          {scanState === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Loader2 className="w-10 h-10 text-[#18181B] animate-spin mb-4" />
              <h2 className="font-display text-2xl font-bold text-[#18181B] mb-1">
                CRYPTOGRAPHIC VERIFICATION...
              </h2>
              <p className="font-sans text-xs text-[#6E6D66]">
                Ed25519 signature · Rotating HMAC · Expiry · Revocation list
              </p>
            </motion.div>
          )}

          {/* RESULT STATE */}
          {scanState === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VerificationResultComponent result={result} onScanAgain={handleScanAgain} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
