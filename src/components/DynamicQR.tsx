// ============================================================
// EduPass — Practical Sovereign Concession QR Component
// Supports both Practical Permanent QR (default, for printed & offline passes)
// and Optional Dynamic Anti-Screenshot Mode (30s HMAC)
// ============================================================

import { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { encodeQRData, generateCurrentRotatingCode, secondsUntilRotation } from '../lib/crypto';
import { CheckCircle2, Zap } from 'lucide-react';

interface DynamicQRProps {
  credential: string;     // canonical payload string
  signatureHex: string;   // hex-encoded signature
  seedHex: string;        // hex-encoded HMAC seed
  size?: number;
  allowToggleMode?: boolean;
}

export default function DynamicQR({
  credential,
  signatureHex,
  seedHex,
  size = 220,
  allowToggleMode = true,
}: DynamicQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Default to practical permanent mode as requested by transit authorities
  const [mode, setMode] = useState<'permanent' | 'dynamic'>('permanent');
  const [countdown, setCountdown] = useState(secondsUntilRotation());
  const [currentCode, setCurrentCode] = useState('');

  const generateQR = useCallback(async () => {
    if (!canvasRef.current) return;

    // In permanent mode, use fixed seed fragment for persistent validity
    const rotatingCode =
      mode === 'dynamic'
        ? generateCurrentRotatingCode(seedHex)
        : seedHex.slice(0, 8);

    setCurrentCode(rotatingCode);
    const qrPayload = encodeQRData(credential, signatureHex, rotatingCode);

    try {
      await QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: size,
        margin: 2,
        color: {
          dark: '#18181B',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  }, [credential, signatureHex, seedHex, size, mode]);

  useEffect(() => {
    generateQR();

    if (mode === 'dynamic') {
      const interval = setInterval(() => {
        const remaining = secondsUntilRotation();
        setCountdown(remaining);

        if (remaining <= 1) {
          setTimeout(generateQR, 100);
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [generateQR, mode]);

  return (
    <div className="flex flex-col items-center gap-3 font-sans">
      {/* QR Code Canvas */}
      <div className="relative bg-white p-3 rounded-2xl shadow-xs border border-[#E5E0D6]">
        <canvas ref={canvasRef} className="block rounded-xl" />
      </div>

      {/* Mode Indicator & Toggle */}
      {mode === 'permanent' ? (
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EAF0EC] border border-[#23533D]/20 rounded-full text-[11px] font-mono font-bold text-[#23533D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>PRACTICAL TRANSIT QR · SEMESTER VALID</span>
          </div>
          <span className="text-[10px] text-stone-500">
            Conductors scan instantly offline (zero 30s timeout delays)
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-mono font-bold text-amber-900">
            <Zap className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>DYNAMIC TOKEN · REFRESHES IN {countdown}s</span>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            Token: <strong>{currentCode}</strong>
          </span>
        </div>
      )}

      {/* Optional Mode Switcher */}
      {allowToggleMode && (
        <button
          type="button"
          onClick={() => setMode(mode === 'permanent' ? 'dynamic' : 'permanent')}
          className="text-[10px] text-stone-500 hover:text-stone-800 underline transition-colors cursor-pointer pt-0.5"
        >
          {mode === 'permanent'
            ? 'Switch to Experimental Dynamic Mode (30s)'
            : 'Switch to Practical Permanent Mode (Standard)'}
        </button>
      )}
    </div>
  );
}
