// ============================================================
// EduPass — Student Concession Account Hub
// Styled in warm studio beige with Fraunces & Montserrat
// Features: Active Pass Overview, Savings Tracker, Corridor Preview,
// Quick Actions, and Lifecycle Application Timeline
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  FileText,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  FileCheck,
  TrendingUp,
  Leaf,
  MapPin,
  Bus,
  ChevronRight,
} from 'lucide-react';
import Header from '../../components/Header';
import { passes, applications } from '../../lib/data-store';

export default function StudentDashboard() {
  const pass = passes.find((p) => p.id === 'EP-001') || passes[0];
  const app = applications.find((a) => a.name === 'Pooja M') || applications[0];
  const daysRemaining = pass
    ? Math.max(0, Math.ceil((pass.validUntil - Math.floor(Date.now() / 1000)) / 86400))
    : 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 pt-6 sm:pt-8 pb-12 w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E6D66] font-bold">
              Student Transit Account
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              {pass?.name || 'Pooja M'}
            </h1>
            <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
              {pass?.institution || 'Government Engineering College, Thrissur'}
            </p>
          </div>

          <Link
            to="/student/pass"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-[#2B2B30] transition-colors shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Pass</span>
          </Link>
        </div>

        {/* Pass Status Summary Card */}
        {pass && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#18181B] rounded-3xl p-6 text-white mb-6 shadow-md border border-[#2B2B30] relative overflow-hidden"
          >
            {/* Iridescent Accent Strip */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block">
                  Active Concession Credential
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="font-display text-2xl font-bold">{pass.id}</h2>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-bold">
                    ED25519
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 rounded-full border border-emerald-700/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                  Active
                </span>
              </div>
            </div>

            {/* Corridor Snapshot */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-300">Thrissur Central ↔ Kunnamkulam</span>
              </div>
              <span className="font-mono text-[10px] text-stone-400">34 KM</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10 font-sans">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                    Validity Remaining
                  </span>
                  <span className="font-bold text-xs text-white">{daysRemaining} Days</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                    Offline Security
                  </span>
                  <span className="font-bold text-xs text-emerald-400">Verified & Cached</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-sans">
              <span className="text-stone-400">Need to present on bus?</span>
              <Link
                to="/student/pass"
                className="inline-flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
              >
                <span>Launch Dynamic QR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Student Concession Savings & Eco Impact */}
        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs font-sans mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#23533D]" />
              <h3 className="font-display font-bold text-sm text-[#18181B]">
                Concession Benefits to Date
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#6E6D66]">Semester 2026</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
              <span className="text-[10px] text-[#6E6D66] uppercase block font-semibold">Total Rides</span>
              <span className="text-sm font-mono font-bold text-[#18181B]">142</span>
            </div>
            <div className="p-3 bg-[#EAF0EC] rounded-xl border border-[#23533D]/20">
              <span className="text-[10px] text-[#23533D] uppercase block font-bold">Money Saved</span>
              <span className="text-sm font-mono font-bold text-[#23533D]">₹4,317</span>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#6E6D66] uppercase block font-semibold flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" /> CO₂ Offset
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">156 kg</span>
            </div>
          </div>
        </div>

        {/* Quick Operations Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 font-sans">
          <Link
            to="/student/pass"
            className="p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center text-center group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-colors mb-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-[#18181B]">Digital Pass</span>
            <span className="text-[10px] text-[#6E6D66] mt-0.5">Rotating QR</span>
          </Link>

          <Link
            to="/student/apply"
            className="p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center text-center group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-colors mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-[#18181B]">Renew / Apply</span>
            <span className="text-[10px] text-[#6E6D66] mt-0.5">New Corridor</span>
          </Link>

          <Link
            to="/conductor/scan"
            className="p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center text-center group shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-colors mb-2">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-[#18181B]">Conductor Scan</span>
            <span className="text-[10px] text-[#6E6D66] mt-0.5">Test Reader</span>
          </Link>
        </div>

        {/* Lifecycle Application Timeline */}
        {app && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs"
          >
            <h3 className="font-display font-bold text-sm text-[#18181B] mb-4">
              Concession Credential Timeline
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: 'Application & Proof Submitted',
                  desc: 'Uploaded to Supabase Cloud Storage',
                  time: app.submittedAt,
                  icon: FileCheck,
                  done: true,
                },
                {
                  label: 'Institutional Registry Endorsed',
                  desc: 'Bona fide enrollment verified by CET',
                  time: app.submittedAt + 3600,
                  icon: Shield,
                  done: true,
                },
                {
                  label: 'KSRTC Officer Ed25519 Signed',
                  desc: 'Asymmetric signature issued server-side',
                  time: app.approvedAt || app.submittedAt + 7200,
                  icon: CreditCard,
                  done: true,
                },
                {
                  label: 'Offline Conductor Roster Active',
                  desc: 'Verifiable without mobile data coverage',
                  time: pass?.issuedAt,
                  icon: Clock,
                  done: true,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#EAF0EC] text-[#23533D] flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-bold text-[#18181B]">{item.label}</p>
                    <p className="font-sans text-[11px] text-[#6E6D66]">{item.desc}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#23533D] shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
