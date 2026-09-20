// ============================================================
// EduPass — Forged Pass (Tamper Test)
// ============================================================
// Takes a real signed credential, modifies ONE character,
// displays the tampered QR. When scanned, Ed25519 verification
// GENUINELY fails — no simulation.
// ============================================================

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';
import { passes } from '../../lib/data-store';
import { encodeQRData, generateCurrentRotatingCode } from '../../lib/crypto';
import type { Pass } from '../../lib/types';

export default function ForgedPass() {
  const [pass, setPass] = useState<Pass | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const livePass = passes.find(p => p.id === 'EP-001');
    if (livePass) setPass(livePass);
  }, []);

  useEffect(() => {
    if (!pass || !canvasRef.current) return;

    const generateForgedQR = async () => {
      // Take the REAL credential and tamper with it
      // Modify one character in the name to create a forged credential
      const tamperedCredential = pass.credential.replace('Pooja M', 'Pooja X');

      // Use the REAL signature (which was for the original payload)
      // This creates a genuine signature mismatch
      const rotatingCode = generateCurrentRotatingCode(pass.seed);
      const qrPayload = encodeQRData(tamperedCredential, pass.signature, rotatingCode);

      await QRCode.toCanvas(canvasRef.current!, qrPayload, {
        width: 240,
        margin: 2,
        color: { dark: '#C94B4B', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
    };

    generateForgedQR();

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          generateForgedQR();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pass]);

  if (!pass) return null;

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
                Cryptographic Tamper Test
              </h1>
              <p className="font-sans text-[10px] text-[#B93838] font-bold uppercase tracking-wider">
                Deliberately Modified Payload
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B93838]" />
            <span className="text-[10px] font-mono font-bold text-[#B93838] uppercase">Tampered</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 w-full flex-1">
        {/* Warning Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white border border-rose-200 rounded-2xl mb-6 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B93838] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-[#B93838]">
                Asymmetric Signature Tamper Harness
              </h3>
              <p className="font-sans text-xs text-[#6E6D66] mt-1 leading-relaxed">
                The student identity payload was altered from "Pooja M" to "Pooja X" after the Ed25519 signature
                was generated. When scanned with the Conductor Terminal in airplane mode, mathematical verification
                fails immediately.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Forged Pass Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#18181B] rounded-2xl p-6 text-white mb-6 shadow-xl border border-[#2B2B30]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-display text-2xl font-bold">EduPass</span>
              <p className="font-mono text-[10px] text-rose-400 mt-0.5 uppercase tracking-widest">
                TAMPERED CREDENTIAL
              </p>
            </div>
            <span className="px-2.5 py-0.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-mono font-bold rounded-full uppercase">
              Modified Name
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-rose-900/50 border border-rose-700/50 flex items-center justify-center text-xl font-display font-bold text-rose-200">
              P
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg">
                Pooja <span className="line-through opacity-50">M</span> <span className="text-yellow-300">X</span>
              </h3>
              <p className="font-sans text-xs text-stone-300">{pass.institution}</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <p className="font-mono text-[10px] text-stone-300">
              Payload mismatch detected by Ed25519 public key verification
            </p>
          </div>
        </motion.div>

        {/* Forged QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E5E0D6] p-6 mb-6 shadow-xs text-center"
        >
          <h3 className="font-display font-bold text-base text-[#18181B] mb-1">
            Tampered QR Token
          </h3>
          <p className="font-sans text-xs text-[#6E6D66] mb-4">
            Scan with the Conductor Scanner to observe instant mathematical rejection
          </p>

          <div className="flex justify-center mb-4">
            <canvas ref={canvasRef} className="rounded-xl border border-rose-200" />
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
