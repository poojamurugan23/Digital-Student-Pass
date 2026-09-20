// ============================================================
// EduPass — Conductor Scan Audit Log
// Overprint editorial aesthetic: Fraunces & Montserrat, warm beige
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Clock, Cloud, CloudOff, QrCode } from 'lucide-react';
import { getAllScanLogs } from '../../lib/offline-store';
import type { ScanLog } from '../../lib/types';
import OfflineIndicator from '../../components/OfflineIndicator';

export default function ConductorLog() {
  const [logs, setLogs] = useState<ScanLog[]>([]);

  useEffect(() => {
    getAllScanLogs().then(setLogs);
    const interval = setInterval(() => {
      getAllScanLogs().then(setLogs);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
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
                Scan Audit History
              </h1>
              <p className="font-sans text-[10px] text-[#6E6D66]">{logs.length} on-bus scan logs</p>
            </div>
          </div>
          <OfflineIndicator />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 w-full flex-1">
        {logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E0D6] p-8 shadow-xs">
            <Clock className="w-10 h-10 text-[#6E6D66] mx-auto mb-3 opacity-60" />
            <h3 className="font-display text-lg font-bold text-[#18181B]">No Scans Recorded</h3>
            <p className="font-sans text-xs text-[#6E6D66] mt-1 mb-6">
              Verified passenger scans performed in offline or online mode will appear here.
            </p>
            <Link
              to="/conductor/scan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-[#2A2A2E] transition-all shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Open Scanner</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {log.result === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-[#23533D]" />}
                    {log.result === 'REJECTED' && <XCircle className="w-4 h-4 text-[#B93838]" />}
                    {log.result === 'LIMITED' && <AlertTriangle className="w-4 h-4 text-[#B47828]" />}
                    <span className="font-mono font-bold text-sm text-[#18181B]">{log.passId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.syncStatus === 'SYNCED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#23533D]">
                        <Cloud className="w-3 h-3" /> Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#B47828]">
                        <CloudOff className="w-3 h-3" /> Pending Sync
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#6E6D66] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5E0D6]">
                      {log.verificationTimeMs.toFixed(1)}ms
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-[#FAF7F2]">
                  <span
                    className={`font-semibold uppercase text-[10px] tracking-wider ${
                      log.result === 'VERIFIED'
                        ? 'text-[#23533D]'
                        : log.result === 'REJECTED'
                        ? 'text-[#B93838]'
                        : 'text-[#B47828]'
                    }`}
                  >
                    {log.result}
                    {log.reason ? ` — ${log.reason}` : ''}
                  </span>
                  <span className="text-[10px] text-[#6E6D66] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

