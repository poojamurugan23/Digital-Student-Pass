// ============================================================
// EduPass — Verification Result Component
// Overprint editorial aesthetic: Fraunces & Montserrat, warm beige
// ============================================================

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Shield, QrCode } from 'lucide-react';
import type { VerificationResult as VResult } from '../lib/types';

interface Props {
  result: VResult;
  onScanAgain: () => void;
}

export default function VerificationResult({ result, onScanAgain }: Props) {
  const isGreen = result.status === 'VERIFIED';
  const isAmber = result.status === 'LIMITED';

  const cardBorderClass = isGreen
    ? 'border-[#23533D]/30 bg-[#FAF7F2]'
    : isAmber
    ? 'border-[#B47828]/30 bg-[#FAF7F2]'
    : 'border-rose-300 bg-[#FAF7F2]';

  const iconBgClass = isGreen
    ? 'bg-[#23533D] text-white'
    : isAmber
    ? 'bg-[#B47828] text-white'
    : 'bg-[#B93838] text-white';

  const textClass = isGreen
    ? 'text-[#23533D]'
    : isAmber
    ? 'text-[#B47828]'
    : 'text-[#B93838]';

  const statusText = isGreen
    ? 'AUTHENTICATED OFFLINE'
    : isAmber
    ? 'LIMITED OFFLINE PASS'
    : 'CREDENTIAL REJECTED';

  const statusIcon = isGreen
    ? <CheckCircle2 className="w-10 h-10" />
    : isAmber
    ? <AlertTriangle className="w-10 h-10" />
    : <XCircle className="w-10 h-10" />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`rounded-2xl border-2 ${cardBorderClass} overflow-hidden shadow-lg`}
    >
      {/* Status Header */}
      <div className="p-8 text-center bg-white border-b border-[#E5E0D6]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
          className={`w-20 h-20 rounded-2xl ${iconBgClass} flex items-center justify-center mx-auto mb-4 shadow-md`}
        >
          {statusIcon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E6D66] font-bold block mb-1">
            Cryptographic Verdict
          </span>
          <h2 className={`font-display text-2xl sm:text-3xl font-bold ${textClass} tracking-tight leading-tight`}>
            {statusText}
          </h2>

          {/* Verification Time */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] mt-4">
            <Clock className="w-3.5 h-3.5 text-[#6E6D66]" />
            <span className="font-mono font-bold text-xs text-[#18181B]">
              {result.verificationTimeMs.toFixed(2)} ms
            </span>
            <span className="text-[10px] font-sans text-[#6E6D66]">
              offline latency
            </span>
          </div>
        </motion.div>
      </div>

      {/* Reason (for amber/red) */}
      {result.reason && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-6 my-4 p-4 bg-white rounded-xl border border-[#E5E0D6] shadow-xs"
        >
          <span className="text-[10px] font-mono uppercase font-bold text-[#B93838] tracking-wider block mb-1">
            Reason Code
          </span>
          <p className="font-sans text-xs font-bold text-[#18181B]">{result.reason}</p>
          {isAmber && (
            <p className="font-sans text-[11px] text-[#6E6D66] mt-1">
              Ed25519 signature verified mathematically, but student record is absent from this depot's cached offline roster.
            </p>
          )}
        </motion.div>
      )}

      {/* Credential Details */}
      {result.credential && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-6 my-4 p-5 bg-white rounded-xl border border-[#E5E0D6] shadow-xs font-sans text-xs"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#6E6D66] uppercase tracking-wider block mb-0.5">
                Pass ID
              </span>
              <p className="font-mono font-bold text-sm text-[#18181B]">{result.credential.passId}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-[#6E6D66] uppercase tracking-wider block mb-0.5">
                Student Name
              </span>
              <p className="font-semibold text-sm text-[#18181B]">{result.credential.name}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-[#FAF7F2]">
              <span className="text-[10px] font-mono font-bold text-[#6E6D66] uppercase tracking-wider block mb-0.5">
                Institution
              </span>
              <p className="font-medium text-[#18181B]">{result.credential.institution}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-[#FAF7F2] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#6E6D66] uppercase tracking-wider block mb-0.5">
                  Valid Until
                </span>
                <p className="font-medium text-[#18181B]">
                  {new Date(result.credential.validUntil * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-[#6E6D66] uppercase tracking-wider block mb-0.5">
                  Classification
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EFE9DF] text-[#18181B]">
                  {result.credential.passClass || 'STUDENT'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Verification Metadata Footer */}
      <div className="px-6 py-3 border-t border-[#E5E0D6] bg-white flex items-center justify-between text-xs font-sans text-[#6E6D66]">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Shield className="w-3.5 h-3.5 text-[#23533D]" />
          <span>Ed25519 + HMAC-SHA256</span>
        </div>
        <span className="font-mono text-[11px]">
          {new Date(result.timestamp).toLocaleTimeString('en-IN')}
        </span>
      </div>

      {/* Scan Again Action */}
      <div className="p-4 bg-[#FAF7F2] border-t border-[#E5E0D6]">
        <button
          onClick={onScanAgain}
          className="w-full py-3.5 bg-[#18181B] text-white font-sans font-semibold text-xs rounded-full flex items-center justify-center gap-2 hover:bg-[#2A2A2E] active:scale-[0.98] transition-all shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Next Student Pass</span>
        </button>
      </div>
    </motion.div>
  );
}

