// ============================================================
// EduPass — Sovereign QR Scanner Component
// ============================================================
// Camera-based QR scanner using react-zxing.
// Includes offline simulation triggers for evaluating verification without physical cameras.
// ============================================================

import { useState, useCallback } from 'react';
import { useZxing } from 'react-zxing';
import { Camera, AlertCircle, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { passes } from '../lib/data-store';
import { encodeQRData, generateCurrentRotatingCode } from '../lib/crypto';

interface QRScannerProps {
  onScan: (data: string) => void;
  active?: boolean;
}

export default function QRScanner({ onScan, active = true }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const { ref } = useZxing({
    paused: !started || !active || scanned,
    onDecodeResult(result) {
      if (!scanned) {
        setScanned(true);
        const text = typeof result === 'string' ? result : (result as { rawValue?: string }).rawValue || String(result);
        onScan(text);
      }
    },
    onError(err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. You can use the Quick Simulator below to test verification.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera detected. You can use the Quick Simulator below to test offline verification.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is in use by another application.');
        }
      }
    },
  });

  const handleStart = useCallback(() => {
    setError(null);
    setScanned(false);
    setStarted(true);
  }, []);

  const handleReset = useCallback(() => {
    setScanned(false);
    setError(null);
  }, []);

  // Quick Simulation Triggers
  const simulateScan = (type: 'practical' | 'dynamic' | 'forged' | 'revoked') => {
    const pass = passes[0];
    if (!pass) return;

    let payload = pass.credential;
    let sig = pass.signature;
    let code = pass.seed.slice(0, 8); // Practical permanent code

    if (type === 'dynamic') {
      code = generateCurrentRotatingCode(pass.seed);
    } else if (type === 'forged') {
      payload = pass.credential.replace('Pooja M', 'Pooja X');
      code = generateCurrentRotatingCode(pass.seed);
    } else if (type === 'revoked') {
      // Use pass marked revoked or pass ID with revoked status
      const revokedPass = passes.find(p => p.revoked) || pass;
      payload = revokedPass.credential;
      sig = revokedPass.signature;
      code = revokedPass.seed.slice(0, 8);
    }

    const qrData = encodeQRData(payload, sig, code);
    setScanned(true);
    onScan(qrData);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setScanned(true);
    onScan(manualCode.trim());
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Error Banner */}
      {error && (
        <div className="flex flex-col items-center gap-3 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-amber-600" />
          <p className="text-xs font-sans font-medium text-stone-700 text-center">{error}</p>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-[#18181B] text-white font-sans font-semibold text-xs rounded-xl hover:bg-[#2B2B30] transition-colors cursor-pointer"
          >
            Retry Camera Access
          </button>
        </div>
      )}

      {/* Main Scanner Card */}
      {!started ? (
        <div className="flex flex-col items-center gap-4 p-7 bg-white border border-[#E5E0D6] rounded-3xl shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF0EC] flex items-center justify-center text-[#23533D]">
            <Camera className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-display font-bold text-base text-[#18181B] mb-1">
              Conductor Camera Scanner
            </h3>
            <p className="font-sans text-xs text-[#6E6D66] max-w-xs">
              Point your camera at the student's concession card or mobile screen to verify Ed25519 signatures offline.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full max-w-xs px-5 py-3 bg-[#18181B] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2B2B30] transition-colors shadow-sm cursor-pointer"
          >
            Enable Bus Terminal Camera
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Camera feed */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-sm mx-auto shadow-inner">
            <video ref={ref} className="w-full h-full object-cover" />

            {/* Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

              {!scanned && (
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2" />
              )}
            </div>

            {scanned && (
              <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 text-center">
            {scanned ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-emerald-700">QR Code Captured</span>
                <button
                  onClick={handleReset}
                  className="text-xs font-medium text-[#18181B] underline cursor-pointer"
                >
                  Scan Another Pass
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-[#6E6D66] animate-pulse">
                Align QR code within view finder...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Evaluation & Quick Simulator Triggers */}
      <div className="p-4 bg-white border border-[#E5E0D6] rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <h4 className="text-xs font-sans font-bold text-[#18181B] uppercase tracking-wider">
            Quick Simulator (Instant Offline Verification)
          </h4>
        </div>
        <p className="text-[11px] text-[#6E6D66] mb-3 leading-relaxed">
          Test cryptographic verification without pointing physical cameras:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => simulateScan('practical')}
            className="p-2.5 bg-[#EAF0EC] hover:bg-[#d8e6dc] border border-[#23533D]/20 rounded-xl text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#23533D]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Valid Practical Pass</span>
            </div>
            <span className="text-[10px] text-stone-600 block mt-0.5">
              Permanent semester QR (Pooja M)
            </span>
          </button>

          <button
            type="button"
            onClick={() => simulateScan('dynamic')}
            className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Valid Dynamic Token</span>
            </div>
            <span className="text-[10px] text-amber-700 block mt-0.5">
              30-Second rotating HMAC QR
            </span>
          </button>

          <button
            type="button"
            onClick={() => simulateScan('forged')}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Forged Pass</span>
            </div>
            <span className="text-[10px] text-rose-700 block mt-0.5">
              Tampered Ed25519 signature
            </span>
          </button>

          <button
            type="button"
            onClick={() => simulateScan('revoked')}
            className="p-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-600" />
              <span>Revoked Pass</span>
            </div>
            <span className="text-[10px] text-zinc-600 block mt-0.5">
              Blacklisted concession roster
            </span>
          </button>
        </div>

        {/* Manual Payload Paste Fallback */}
        <form onSubmit={handleManualSubmit} className="mt-3 pt-3 border-t border-[#E5E0D6] flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Or paste Base64URL dot-delimited QR string..."
            className="flex-1 px-3 py-1.5 text-[11px] font-mono bg-[#FAF7F2] border border-[#E5E0D6] rounded-lg focus:outline-none focus:border-[#18181B]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#18181B] text-white text-xs font-semibold rounded-lg hover:bg-[#2B2B30] cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
