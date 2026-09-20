// ============================================================
// EduPass — State Transport Directorate & Oversight Command
// Overprint editorial aesthetic: Fraunces & Montserrat, warm beige
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cloud,
} from 'lucide-react';
import Header from '../../components/Header';
import { passes, scanLogs, applications, suspiciousActivities } from '../../lib/data-store';
import { SUPABASE_URL } from '../../lib/supabase';

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fraud' | 'routes'>('overview');

  const totalPasses = passes.length;
  const activePasses = passes.filter((p) => !p.revoked).length;
  const totalScans = scanLogs.length;
  const verifiedScans = scanLogs.filter((s) => s.result === 'VERIFIED').length;
  const rejectedScans = scanLogs.filter((s) => s.result === 'REJECTED').length;
  const suspiciousCount = suspiciousActivities.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
        {/* Top Header & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/review"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#6E6D66] hover:text-[#18181B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Operations Hub</span>
            </Link>
            <span className="text-[#E5E0D6]">/</span>
            <span className="text-xs font-sans text-[#6E6D66]">State Oversight</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#E5E0D6] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#23533D] shrink-0" />
                <span className="text-[11px] font-mono font-bold tracking-wide text-[#6E6D66] uppercase">
                  Kerala Motor Vehicles Dept & KSRTC Directorate
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
                State Transport Oversight Command
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1 max-w-2xl">
                State-wide digital public infrastructure analytics, live conductor cryptographic scan streams, and corridor fraud monitoring.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#EAF0EC] text-[#23533D] border border-[#23533D]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Supabase Live</span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Active Concessions
              </span>
              <div className="font-display text-3xl font-bold text-[#18181B]">{activePasses}</div>
            </div>
            <div className="text-[11px] font-sans text-[#6E6D66] mt-3 pt-3 border-t border-[#FAF7F2]">
              {totalPasses} issued state-wide
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Verified Scans
              </span>
              <div className="font-display text-3xl font-bold text-[#23533D]">{verifiedScans}</div>
            </div>
            <div className="text-[11px] font-sans text-[#6E6D66] mt-3 pt-3 border-t border-[#FAF7F2]">
              {verifiedScans} / {totalScans} verified offline
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Security Flags
              </span>
              <div className="font-display text-3xl font-bold text-[#B93838]">
                {rejectedScans + suspiciousCount}
              </div>
            </div>
            <div className="text-[11px] font-sans text-[#6E6D66] mt-3 pt-3 border-t border-[#FAF7F2]">
              Tamper & duplicate blocks
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Registered Students
              </span>
              <div className="font-display text-3xl font-bold text-[#18181B]">{applications.length}</div>
            </div>
            <div className="text-[11px] font-sans text-[#6E6D66] mt-3 pt-3 border-t border-[#FAF7F2]">
              Across accredited colleges
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs - Overprint pill tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#E5E0D6] pb-3">
          {[
            { id: 'overview', label: 'Conductor Verification Ledger' },
            { id: 'fraud', label: `Corridor Fraud Alarms (${suspiciousCount})` },
            { id: 'routes', label: 'Transit Corridor Demographics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-sans font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#6E6D66] hover:text-[#18181B] hover:bg-[#EFE9DF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Regional Verification Stream */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E0D6]">
                <h2 className="font-display font-bold text-lg text-[#18181B]">
                  Live Conductor Scan Ledger
                </h2>
                <span className="text-xs font-sans text-[#6E6D66]">
                  Verified offline on-bus · Replicated to Supabase
                </span>
              </div>

              {scanLogs.length === 0 ? (
                <div className="py-12 text-center text-[#6E6D66] font-sans text-xs">
                  No conductor scans logged yet. Perform a scan with the Conductor Scanner to populate live records.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#E5E0D6] text-[#6E6D66] uppercase text-[10px] tracking-wider">
                        <th className="pb-2.5">Timestamp</th>
                        <th className="pb-2.5">Credential ID</th>
                        <th className="pb-2.5">Verification</th>
                        <th className="pb-2.5">Execution Mode</th>
                        <th className="pb-2.5">Latency</th>
                        <th className="pb-2.5">Device Identifier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FAF7F2]">
                      {scanLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF7F2]/60">
                          <td className="py-3 font-mono text-[#6E6D66]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 font-mono font-bold text-[#18181B]">{log.passId}</td>
                          <td className="py-3">
                            {log.result === 'VERIFIED' ? (
                              <span className="inline-flex items-center gap-1 text-[#23533D] font-bold bg-[#EAF0EC] px-2.5 py-0.5 rounded-full border border-[#23533D]/20">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </span>
                            ) : log.result === 'LIMITED' ? (
                              <span className="inline-flex items-center gap-1 text-[#8E4B10] font-bold bg-[#FDF6B2] px-2.5 py-0.5 rounded-full border border-[#FDF6B2]">
                                <AlertTriangle className="w-3 h-3" /> LIMITED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#B93838] font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                <XCircle className="w-3 h-3" /> {log.reason || 'REJECTED'}
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EFE9DF] text-[#18181B] border border-[#E5E0D6]">
                              {log.verificationMode}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-[#6E6D66]">
                            {log.verificationTimeMs.toFixed(1)} ms
                          </td>
                          <td className="py-3 font-mono text-[10px] text-[#6E6D66]">
                            {log.deviceId.slice(0, 12)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Cloud Architecture Info */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D6] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-sans shadow-xs">
              <div className="flex items-center gap-2 text-[#18181B]">
                <Cloud className="w-4 h-4 shrink-0 text-[#23533D]" />
                <span>
                  <strong>Cloud Synchronization:</strong> Supabase PostgreSQL Database & Storage active at{' '}
                  <code className="font-mono text-[11px] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5E0D6]">
                    {SUPABASE_URL}
                  </code>
                </span>
              </div>
              <Link
                to="/review"
                className="text-xs font-sans font-bold text-[#18181B] hover:text-[#23533D] transition-colors shrink-0"
              >
                View System Health →
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Fraud Alerts */}
        {activeTab === 'fraud' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs">
              <h2 className="font-display font-bold text-lg text-[#18181B] mb-1">
                Cryptographic Fraud & Tamper Incident Log
              </h2>
              <p className="text-xs text-[#6E6D66] font-sans mb-4">
                Instances where Ed25519 signatures, timestamp bounds, or rotating HMAC seeds failed
                validation during conductor scans:
              </p>

              {suspiciousActivities.length === 0 ? (
                <div className="p-8 text-center text-[#6E6D66] text-xs font-sans bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  No duplicate usage or cloning detected in current session.
                </div>
              ) : (
                <div className="space-y-3">
                  {suspiciousActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-[#B93838] shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs font-sans">
                        <div className="font-bold text-[#18181B] flex items-center gap-2">
                          <span>{act.type}</span>
                          <span className="font-mono font-normal text-[#6E6D66]">
                            [{act.passId}]
                          </span>
                        </div>
                        <p className="text-[#6E6D66] mt-0.5">{act.description}</p>
                        <div className="text-[10px] text-[#6E6D66] mt-1 font-mono">
                          Detected: {new Date(act.detectedAt).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-100 text-[#B93838] uppercase">
                        Action Required
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Route Passenger Loads */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Route #441 · Fast Passenger
              </span>
              <h3 className="font-display font-bold text-lg text-[#18181B] mb-2">
                Trivandrum ↔ Ernakulam
              </h3>
              <div className="font-display text-2xl font-bold text-[#23533D]">428 Students</div>
              <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden mt-3 border border-[#E5E0D6]">
                <div className="bg-[#23533D] h-full w-[78%]" />
              </div>
              <div className="text-[10px] font-sans text-[#6E6D66] mt-2 text-right">78% Subsidy Capacity</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Route #209 · Super Fast
              </span>
              <h3 className="font-display font-bold text-lg text-[#18181B] mb-2">
                Ernakulam ↔ Calicut
              </h3>
              <div className="font-display text-2xl font-bold text-[#18181B]">312 Students</div>
              <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden mt-3 border border-[#E5E0D6]">
                <div className="bg-[#18181B] h-full w-[62%]" />
              </div>
              <div className="text-[10px] font-sans text-[#6E6D66] mt-2 text-right">62% Subsidy Capacity</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs">
              <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-1">
                Route #118 · City Shuttle
              </span>
              <h3 className="font-display font-bold text-lg text-[#18181B] mb-2">
                Calicut ↔ Kannur
              </h3>
              <div className="font-display text-2xl font-bold text-[#18181B]">189 Students</div>
              <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden mt-3 border border-[#E5E0D6]">
                <div className="bg-[#B47828] h-full w-[45%]" />
              </div>
              <div className="text-[10px] font-sans text-[#6E6D66] mt-2 text-right">45% Subsidy Capacity</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
