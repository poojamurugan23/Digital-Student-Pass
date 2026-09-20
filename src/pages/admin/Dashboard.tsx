// ============================================================
// EduPass — Depot Administration & Concession Management
// Overprint editorial aesthetic: Fraunces & Montserrat, warm beige
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShieldAlert
} from 'lucide-react';
import Header from '../../components/Header';
import { getStats, applications, suspiciousActivities } from '../../lib/data-store';

export default function AdminDashboard() {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    const interval = setInterval(() => setStats(getStats()), 3000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Pending Review', value: stats.pendingApplications, note: 'Depot queue awaiting signature' },
    { label: 'Approved Credentials', value: stats.approvedApplications, note: 'Ed25519 signed this term' },
    { label: 'Active Fleet Passes', value: stats.activePasses, note: 'Currently valid on transit fleet' },
    { label: 'Revoked Credentials', value: stats.revokedPasses, note: 'Blacklisted / expired cards' },
    { label: 'Security Anomaly Flags', value: stats.suspiciousCount, note: 'Tamper or duplicate triggers' },
    { label: "Today's Verified Scans", value: stats.totalScans, note: 'Offline conductor validations' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
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
            <span className="text-xs font-sans text-[#6E6D66]">Depot Operations</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#E5E0D6] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#23533D] shrink-0" />
                <span className="text-[11px] font-mono font-bold tracking-wide text-[#6E6D66] uppercase">
                  Trivandrum Central Depot · Depot Console
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
                Depot Operations Console
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1 max-w-2xl">
                Real-time management of student concession applications, cryptographic issuance, and depot route quotas.
              </p>
            </div>

            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-[#2A2A2E] active:scale-[0.98] transition-all shadow-sm self-start sm:self-auto"
            >
              <span>Application Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric Grid — Overprint Style Clean Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs hover:border-[#18181B]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-sans font-bold text-[#6E6D66] uppercase tracking-wider block mb-2">
                  {card.label}
                </span>
                <p className="font-display text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
                  {card.value}
                </p>
              </div>
              <p className="font-sans text-[11px] text-[#6E6D66] mt-3 pt-3 border-t border-[#FAF7F2]">
                {card.note}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Recent Applications Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs mb-8"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E0D6]">
            <div>
              <h3 className="font-display text-xl font-bold text-[#18181B]">
                Recent Concession Filings
              </h3>
              <p className="font-sans text-xs text-[#6E6D66]">
                Latest student submissions awaiting depot cryptographic signature.
              </p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-sans font-bold text-[#18181B] hover:text-[#23533D] transition-colors"
            >
              Open Queue →
            </Link>
          </div>

          <div className="divide-y divide-[#E5E0D6]">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EFE9DF] border border-[#E5E0D6] flex items-center justify-center font-display text-sm font-bold text-[#18181B]">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-sm text-[#18181B]">{app.name}</p>
                    <p className="font-sans text-xs text-[#6E6D66]">
                      {app.institution} · <span className="font-mono">{app.origin} ↔ {app.destination}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    app.status === 'APPROVED'
                      ? 'bg-[#EAF0EC] text-[#23533D] border border-[#23533D]/20'
                      : app.status === 'PENDING'
                      ? 'bg-[#FDF6B2] text-[#8E4B10] border border-[#FDF6B2]'
                      : 'bg-rose-50 text-[#B93838] border border-rose-200'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security & Tamper Flags */}
        {suspiciousActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-100">
              <ShieldAlert className="w-5 h-5 text-[#B93838]" />
              <div>
                <h3 className="font-display text-lg font-bold text-[#18181B]">
                  Corridor Security & Tamper Alerts
                </h3>
                <p className="font-sans text-xs text-[#6E6D66]">
                  Cryptographic anomaly triggers detected during offline conductor scans.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {suspiciousActivities.map((sa) => (
                <div
                  key={sa.id}
                  className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#B93838] bg-white px-2 py-0.5 rounded border border-rose-200">
                        {sa.passId}
                      </span>
                      <span className="font-sans text-xs font-bold text-[#18181B]">
                        {sa.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#6E6D66] mt-1">
                      {sa.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                    FLAGGED
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

