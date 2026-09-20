// ============================================================
// EduPass — Expired Pass Test
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';
import { passes } from '../../lib/data-store';
import { encodeQRData, generateCurrentRotatingCode } from '../../lib/crypto';

export default function ExpiredPass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState(30);
  const expiredPass = passes.find(p => p.id === 'EP-003');

  useEffect(() => {
    if (!expiredPass || !canvasRef.current) return;

    const generateQR = async () => {
      const rotatingCode = generateCurrentRotatingCode(expiredPass.seed);
      const qrPayload = encodeQRData(expiredPass.credential, expiredPass.signature, rotatingCode);
      await QRCode.toCanvas(canvasRef.current!, qrPayload, {
        width: 240,
        margin: 2,
        color: { dark: '#C94B4B', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
    };

    generateQR();
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { generateQR(); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expiredPass]);

  if (!expiredPass) return null;

  const expiredDate = new Date(expiredPass.validUntil * 1000);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E5E0D6]">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/review"
              className="p-2 -ml-2 hover:bg-[#F0ECE3] rounded-lg transition-colors text-[#18181B]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-base text-[#18181B] leading-tight">
                Expired Pass Verification
              </h1>
              <p className="font-sans text-[10px] text-[#B93838] font-bold uppercase tracking-wider">
                Past Validity Threshold
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#B47828]" />
            <span className="text-[10px] font-mono font-bold text-[#B47828] uppercase">Expired</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 w-full flex-1">
        {/* Warning Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white border border-amber-200 rounded-2xl mb-6 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B47828] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-[#B47828]">
                Credential Validity Terminated
              </h3>
              <p className="font-sans text-xs text-[#6E6D66] mt-1 leading-relaxed">
                Expired on {expiredDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
                While the Ed25519 signature itself is authentic, the canonical Unix validity window is in the past.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expired Pass Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2A2A2E] rounded-2xl p-6 text-white mb-6 shadow-xl border border-[#3E3E42]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-display text-2xl font-bold text-stone-200">EduPass</span>
              <p className="font-mono text-[10px] text-stone-400 mt-0.5 uppercase tracking-widest">
                LAPSED CREDENTIAL
              </p>
            </div>
            <span className="px-2.5 py-0.5 bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-mono font-bold rounded-full uppercase">
              Expired
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-xl font-display font-bold text-stone-300">
              M
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-white">{expiredPass.name}</h3>
              <p className="font-sans text-xs text-stone-300">{expiredPass.institution}</p>
              <p className="font-mono text-[11px] text-amber-300 mt-1">
                Expired: {expiredDate.toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expired QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E5E0D6] p-6 mb-6 shadow-xs text-center"
        >
          <h3 className="font-display font-bold text-base text-[#18181B] mb-1">
            Expired QR Token
          </h3>
          <p className="font-sans text-xs text-[#6E6D66] mb-4">
            Scan with the Conductor Scanner to verify timestamp boundary enforcement
          </p>

          <div className="flex justify-center mb-4">
            <canvas ref={canvasRef} className="rounded-xl border border-stone-200" />
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-[#6E6D66] bg-[#FAF7F2] p-3 rounded-xl border border-[#E5E0D6]">
            <span>Next rotating token:</span>
            <span className="font-mono font-bold text-[#18181B]">{countdown}s</span>
          </div>
        </motion.div>

        {/* Action Link */}
        <Link
          to="/conductor/scan"
          className="w-full py-3.5 bg-[#18181B] text-white font-sans font-semibold text-xs rounded-full flex items-center justify-center gap-2 hover:bg-[#2A2A2E] active:scale-[0.98] transition-all shadow-sm"
        >
          <span>Launch Conductor Scanner to Test Rejection →</span>
        </Link>
      </div>
    </div>
  );
}

