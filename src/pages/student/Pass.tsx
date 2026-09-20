// ============================================================
// EduPass — Sovereign Digital Student Concession Pass
// High-Assurance Physical-Digital Hybrid Credential
// Styled in warm studio beige with Fraunces & Montserrat
// Features: Dynamic Rotating QR, Interactive Card Flip, Fullscreen Scan Mode,
// Corridor Map, Live Bus Timetable, Fare Savings Calculator, Official PDF Certificate,
// On-Bus Inspection Log & Cryptographic Provenance
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Maximize2,
  Minimize2,
  RotateCw,
  Download,
  Clock,
  MapPin,
  Bus,
  Calendar,
  CheckCircle2,
  FileText,
  History,
  Info,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Printer,
  X,
  AlertTriangle,
  TrendingUp,
  Leaf,
  Radio,
} from 'lucide-react';
import Header from '../../components/Header';
import DynamicQR from '../../components/DynamicQR';
import { passes } from '../../lib/data-store';
import type { Pass } from '../../lib/types';

export default function StudentPass() {
  const [selectedPassId, setSelectedPassId] = useState<string>('EP-001');
  const [activeTab, setActiveTab] = useState<'card' | 'routes' | 'history' | 'security'>('card');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreenQR, setIsFullscreenQR] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showGrievance, setShowGrievance] = useState(false);
  const [grievanceSubmittedId, setGrievanceSubmittedId] = useState<string | null>(null);
  const [grievanceText, setGrievanceText] = useState('');
  const [isOfflineCached, setIsOfflineCached] = useState(() => {
    return localStorage.getItem('edupass_offline_cached') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Find currently selected pass
  const pass: Pass | undefined = passes.find((p) => p.id === selectedPassId) || passes[0];

  // Live clock ticker to prove active, non-static credential
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveOffline = () => {
    if (pass) {
      localStorage.setItem('edupass_offline_cached', 'true');
      localStorage.setItem('edupass_cached_pass', JSON.stringify(pass));
      setIsOfflineCached(true);
      showToast('Pass cryptographic tokens saved to local PWA cache. Verifiable without mobile network!');
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `KSRTC-GR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGrievanceSubmittedId(ticketId);
    setTimeout(() => {
      setShowGrievance(false);
      setGrievanceSubmittedId(null);
      setGrievanceText('');
      showToast(`Grievance submitted successfully. Ticket ID: ${ticketId}`);
    }, 2200);
  };

  if (!pass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="font-sans text-[#6E6D66] text-sm">No active concession credential found.</p>
      </div>
    );
  }

  const validDate = new Date(pass.validUntil * 1000);
  const issuedDate = new Date(pass.issuedAt * 1000);
  const isExpired = pass.validUntil < Math.floor(Date.now() / 1000);
  const isRevoked = pass.revoked;
  const daysRemaining = Math.max(0, Math.ceil((pass.validUntil - Math.floor(Date.now() / 1000)) / 86400));
  const totalDays = Math.max(1, Math.ceil((pass.validUntil - pass.issuedAt) / 86400));
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalDays - daysRemaining) / totalDays) * 100)));

  // Mock on-bus conductor inspection history for this pass
  const inspectionHistory = [
    {
      id: 'insp-101',
      busNo: 'KL-15-A-4481',
      route: 'Route 402 · Thrissur ↔ Kunnamkulam',
      depot: 'Thrissur Central',
      conductor: 'Rajesh Kumar (Badge #4481)',
      time: 'Today, 08:14 AM',
      latency: '3.2 ms',
      status: 'VERIFIED',
    },
    {
      id: 'insp-102',
      busNo: 'KL-15-A-3120',
      route: 'Route 402 · Kunnamkulam ↔ Thrissur',
      depot: 'Guruvayur Depot',
      conductor: 'M. Soman (Badge #1902)',
      time: 'Yesterday, 04:42 PM',
      latency: '3.5 ms',
      status: 'VERIFIED',
    },
    {
      id: 'insp-103',
      busNo: 'KL-15-A-4481',
      route: 'Route 402 · Thrissur ↔ Kunnamkulam',
      depot: 'Thrissur Central',
      conductor: 'Rajesh Kumar (Badge #4481)',
      time: '18 Sep 2026, 08:20 AM',
      latency: '2.9 ms',
      status: 'VERIFIED',
    },
  ];

  // Upcoming live bus timetable on authorized corridor
  const corridorDepartures = [
    {
      id: 'bus-1',
      busNo: 'KL-15-A-4481',
      serviceType: 'Ordinary (FP)',
      departs: '08:35 AM',
      inMins: '6 mins',
      platform: 'Bay 4',
      status: 'Boarding Now',
      fareConcession: '100% Covered (₹0)',
    },
    {
      id: 'bus-2',
      busNo: 'KL-15-A-3120',
      serviceType: 'Fast Passenger (LS)',
      departs: '08:50 AM',
      inMins: '21 mins',
      platform: 'Bay 7',
      status: 'On Time',
      fareConcession: '80% Subsidized (₹7.60)',
    },
    {
      id: 'bus-3',
      busNo: 'KL-15-A-5012',
      serviceType: 'Ordinary (FP)',
      departs: '09:10 AM',
      inMins: '41 mins',
      platform: 'Bay 3',
      status: 'Scheduled',
      fareConcession: '100% Covered (₹0)',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 pt-6 sm:pt-8 pb-12 w-full">
        {/* Top Breadcrumb & Live Authenticated Status Pill */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#6E6D66] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Student Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            {isOfflineCached && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5E0D6] text-[10px] font-mono font-bold text-[#18181B]">
                <Radio className="w-3 h-3 text-emerald-600" />
                <span>OFFLINE READY</span>
              </span>
            )}

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                isRevoked
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : isExpired
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-[#EAF0EC] border-[#23533D]/20 text-[#23533D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>
                {isRevoked
                  ? 'PASS REVOKED'
                  : isExpired
                  ? 'PASS EXPIRED'
                  : 'SOVEREIGN PASS ACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Credential State Switcher Pill */}
        <div className="mb-5 p-2.5 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs font-sans">
          <div className="flex items-center justify-between text-[11px] text-[#6E6D66] font-semibold mb-1.5 px-1">
            <span>Pass Simulation Profile:</span>
            <span className="font-mono text-[10px] text-[#23533D]">Live Ed25519 Engine</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
            <button
              onClick={() => setSelectedPassId('EP-001')}
              className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer truncate ${
                selectedPassId === 'EP-001'
                  ? 'bg-[#18181B] text-white font-bold shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B]'
              }`}
            >
              🟢 Active (Pooja)
            </button>
            <button
              onClick={() => setSelectedPassId('EP-003')}
              className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer truncate ${
                selectedPassId === 'EP-003'
                  ? 'bg-amber-800 text-white font-bold shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B]'
              }`}
            >
              🟡 Expired (Meera)
            </button>
            <button
              onClick={() => setSelectedPassId('EP-004')}
              className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer truncate ${
                selectedPassId === 'EP-004'
                  ? 'bg-rose-800 text-white font-bold shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B]'
              }`}
            >
              🔴 Revoked (Ravi)
            </button>
          </div>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex items-center p-1 bg-[#EFE9DF] rounded-xl border border-[#E5E0D6] mb-6 font-sans text-xs font-semibold">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#6E6D66] hover:text-[#18181B]'
            }`}
          >
            Digital Pass
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#6E6D66] hover:text-[#18181B]'
            }`}
          >
            Corridor & Times
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#6E6D66] hover:text-[#18181B]'
            }`}
          >
            Scan Ledger
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#6E6D66] hover:text-[#18181B]'
            }`}
          >
            Provenance
          </button>
        </div>

        {/* TAB 1: Digital Pass View */}
        {activeTab === 'card' && (
          <div className="space-y-6">
            {/* Flip Card Container */}
            <div className="relative perspective-1000">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="transform-style-preserve-3d"
              >
                {/* ============================================================ */}
                {/* CARD FRONT: Sovereign Concession Card                       */}
                {/* ============================================================ */}
                {!isFlipped ? (
                  <div
                    className={`rounded-3xl p-6 sm:p-7 shadow-2xl border relative overflow-hidden text-white transition-colors duration-300 ${
                      isRevoked
                        ? 'bg-gradient-to-br from-zinc-900 via-rose-950 to-zinc-900 border-rose-800'
                        : isExpired
                        ? 'bg-gradient-to-br from-zinc-900 via-amber-950 to-zinc-900 border-amber-800'
                        : 'bg-[#18181B] border-zinc-700'
                    }`}
                  >
                    {/* Iridescent Holographic Anti-Counterfeit Ribbon */}
                    <div
                      className={`absolute top-0 right-0 left-0 h-1.5 ${
                        isRevoked
                          ? 'bg-rose-500'
                          : isExpired
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-emerald-400 via-amber-300 via-teal-400 to-emerald-400 animate-pulse'
                      }`}
                    />

                    {/* Background Seal Watermark */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/3 border border-white/5 pointer-events-none flex items-center justify-center">
                      <Shield className="w-28 h-28 text-white/5" />
                    </div>

                    {/* Card Top Header */}
                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-2xl font-bold tracking-tight text-white">
                            EduPass
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold border ${
                              isRevoked
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : isExpired
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                            }`}
                          >
                            {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : 'DPI · PASS'}
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-stone-300 mt-1">
                          Kerala State Road Transport Corporation
                        </p>
                      </div>

                      {/* Flip Card Button */}
                      <button
                        onClick={() => setIsFlipped(true)}
                        title="View Cryptographic Back"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-sans text-stone-300 transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Flip Back</span>
                      </button>
                    </div>

                    {/* Student Identification Profile */}
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div className="relative">
                        <div
                          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-2xl font-display font-bold text-white shadow-inner border-2 ${
                            isRevoked
                              ? 'bg-rose-900 border-rose-400/40'
                              : isExpired
                              ? 'bg-amber-900 border-amber-400/40'
                              : 'bg-[#23533D] border-emerald-400/40'
                          }`}
                        >
                          {pass.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#18181B] text-[10px] font-bold ${
                            isRevoked
                              ? 'bg-rose-600 text-white'
                              : isExpired
                              ? 'bg-amber-500 text-black'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {isRevoked ? '✕' : isExpired ? '!' : '✓'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                            {pass.name}
                          </h2>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                              isRevoked
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : isExpired
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {isRevoked ? 'INVALID' : isExpired ? 'EXPIRED' : 'VALID'}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-stone-300 truncate mt-0.5">
                          {pass.institution || 'Government Engineering College, Thrissur'}
                        </p>
                        <p className="font-mono text-[11px] text-stone-400 mt-1">
                          Roll: <strong className="text-stone-200">{pass.enrolmentNo || 'GEC2024EE019'}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Route Corridor Banner */}
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4 relative z-10 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                            Authorized Route Corridor
                          </span>
                          <span className="font-bold text-white">Thrissur Central ↔ Kunnamkulam</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-stone-300">
                        34 KM
                      </span>
                    </div>

                    {/* Pass Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/10 font-sans relative z-10">
                      <div>
                        <span className="text-[9px] text-stone-400 uppercase tracking-wider block">
                          Pass Serial
                        </span>
                        <span className="font-mono font-bold text-xs text-white">{pass.id}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 uppercase tracking-wider block">
                          Tariff Class
                        </span>
                        <span className="font-sans font-bold text-xs text-emerald-400">
                          {pass.passClass} (80% SUB)
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 uppercase tracking-wider block">
                          Status Window
                        </span>
                        <span
                          className={`font-sans font-bold text-xs ${
                            isRevoked
                              ? 'text-rose-400'
                              : isExpired
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {isRevoked ? 'Revoked' : isExpired ? 'Expired' : `${daysRemaining} Days Left`}
                        </span>
                      </div>
                    </div>

                    {/* Active Live IST Clock */}
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-stone-400 relative z-10">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>LIVE IST: {currentTime.toLocaleTimeString('en-IN')}</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        NON-TRANSFERABLE
                      </span>
                    </div>
                  </div>
                ) : (
                  /* ============================================================ */
                  /* CARD BACK: Cryptographic Audit Provenance                    */
                  /* ============================================================ */
                  <div className="bg-[#18181B] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-700 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-display font-bold text-lg text-white">
                          Cryptographic Provenance
                        </h3>
                      </div>
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-sans text-stone-300 transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Show Front</span>
                      </button>
                    </div>

                    <p className="font-sans text-xs text-stone-300 mb-4 leading-relaxed">
                      This pass is signed with the State Transport Directorate's Ed25519 private key.
                      Conductor terminals verify this asymmetric signature offline in under 3.4ms.
                    </p>

                    <div className="space-y-3 font-mono text-[11px] bg-white/5 p-4 rounded-xl border border-white/10">
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase">
                          Asymmetric Algorithm
                        </span>
                        <span className="text-emerald-400 font-bold">Ed25519 + HMAC-SHA256</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase">
                          Ed25519 Signature Digest
                        </span>
                        <span className="text-stone-300 break-all text-[10px]">
                          {pass.signature.slice(0, 32)}...{pass.signature.slice(-16)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase">
                          Biometric Photo SHA-256 Hash
                        </span>
                        <span className="text-stone-300 break-all text-[10px]">
                          {pass.photoHash
                            ? `${pass.photoHash.slice(0, 28)}...`
                            : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase">
                          Rotating HMAC Seed
                        </span>
                        <span className="text-amber-400 font-bold">{pass.seed}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-sans text-stone-400">
                      <span>Authority: KSRTC Central Cell</span>
                      <span className="font-mono text-emerald-400">Gazette 2026/TC</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Live Rotating QR Presentation Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#E5E0D6] p-6 shadow-sm text-center"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <h3 className="font-display font-bold text-lg text-[#18181B]">
                    Present to Conductor Scanner
                  </h3>
                  <p className="font-sans text-xs text-[#6E6D66]">
                    Rotates dynamically every 30s to prevent screenshot fraud
                  </p>
                </div>

                {/* Maximize Fullscreen QR Button */}
                <button
                  onClick={() => setIsFullscreenQR(true)}
                  title="Maximize for Conductor"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] text-xs font-sans font-semibold text-[#18181B] hover:bg-[#EFE9DF] transition-colors cursor-pointer shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#23533D]" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>

              {/* QR Container */}
              <div className="inline-block p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] shadow-xs">
                <DynamicQR
                  credential={pass.credential}
                  signatureHex={pass.signature}
                  seedHex={pass.seed}
                  size={210}
                />
              </div>

              {/* Anti-Screenshot Rotation Details */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono text-[#6E6D66]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>
                    Epoch Key: <strong>{pass.seed.slice(0, 8)}</strong>
                  </span>
                </div>
                <span className="hidden sm:inline text-stone-300">·</span>
                <span className="text-[11px] text-[#23533D] font-bold">
                  Conductors verify in Airplane Mode (3.4ms)
                </span>
              </div>
            </motion.div>

            {/* Quick Action Tools Bar */}
            <div className="grid grid-cols-4 gap-2 font-sans">
              <button
                onClick={handleSaveOffline}
                className="p-3 bg-white rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#23533D] group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-[11px] text-[#18181B]">Save Offline</span>
                <span className="text-[9px] text-[#6E6D66]">PWA Cache</span>
              </button>

              <button
                onClick={() => setShowCertificate(true)}
                className="p-3 bg-white rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-[11px] text-[#18181B]">Certificate</span>
                <span className="text-[9px] text-[#6E6D66]">Official PDF</span>
              </button>

              <Link
                to="/conductor/scan"
                className="p-3 bg-white rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs"
              >
                <Bus className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-[11px] text-[#18181B]">Test Scan</span>
                <span className="text-[9px] text-[#6E6D66]">Conductor</span>
              </Link>

              <button
                onClick={() => setShowGrievance(true)}
                className="p-3 bg-white rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-[11px] text-[#18181B]">Report SOS</span>
                <span className="text-[9px] text-[#6E6D66]">Bus Dispute</span>
              </button>
            </div>

            {/* Student Concession Financial Savings & Eco Impact Widget */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs font-sans">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#23533D]" />
                  <h4 className="font-display font-bold text-sm text-[#18181B]">
                    Semester Concession Savings & Eco-Impact
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5E0D6] text-[#6E6D66]">
                  142 Trips Taken
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="text-[10px] text-[#6E6D66] uppercase block font-semibold">Standard Fare</span>
                  <span className="text-xs font-mono text-stone-500 line-through">₹5,396</span>
                </div>
                <div className="p-3 bg-[#EAF0EC] rounded-xl border border-[#23533D]/20">
                  <span className="text-[10px] text-[#23533D] uppercase block font-bold">You Saved</span>
                  <span className="text-sm font-mono font-bold text-[#23533D]">₹4,317</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#6E6D66] uppercase block font-semibold flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" /> CO₂ Avoided
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">156 kg</span>
                </div>
              </div>
            </div>

            {/* Validity Timeline Progress Bar */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs font-sans text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#23533D]" />
                  <span className="font-bold text-[#18181B]">Concession Validity Window</span>
                </div>
                <span
                  className={`font-mono font-bold ${
                    isRevoked ? 'text-rose-700' : isExpired ? 'text-amber-700' : 'text-[#23533D]'
                  }`}
                >
                  {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : `${daysRemaining} Days Remaining`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF7F2] border border-[#E5E0D6] rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isRevoked ? 'bg-rose-600' : isExpired ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6E6D66]">
                <span>Issued: {issuedDate.toLocaleDateString('en-IN')}</span>
                <span>Expires: {validDate.toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Corridor Routes & Live Bus Timetable */}
        {activeTab === 'routes' && (
          <div className="space-y-5 font-sans text-xs">
            {/* Live Corridor Bus Departures Widget */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <h3 className="font-display font-bold text-base text-[#18181B]">
                      Live Departures · Route 402
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#6E6D66]">
                    Thrissur Central Bus Terminal ➔ Kunnamkulam Municipal Stand
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#23533D] font-bold border border-[#E5E0D6]">
                  BAY TRACKER
                </span>
              </div>

              <div className="space-y-2.5">
                {corridorDepartures.map((busItem) => (
                  <div
                    key={busItem.id}
                    className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E0D6] flex items-center justify-center text-[#18181B] font-bold">
                        <Bus className="w-4 h-4 text-[#23533D]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#18181B] flex items-center gap-2">
                          <span>{busItem.busNo}</span>
                          <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-[#E5E0D6] text-stone-700">
                            {busItem.serviceType}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#23533D] font-semibold mt-0.5">
                          {busItem.fareConcession}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#18181B]">
                        {busItem.departs}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold">
                        {busItem.inMins} ({busItem.platform})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corridor Matrix */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
              <h3 className="font-display font-bold text-base text-[#18181B] mb-2">
                Authorized Corridor Route Matrix
              </h3>
              <p className="text-[#6E6D66] mb-4">
                This student concession credential is legally endorsed for round-trip travel along the designated state transport corridor:
              </p>

              {/* Station Route Stops */}
              <div className="space-y-3 pl-2 border-l-2 border-[#18181B] ml-2">
                <div className="relative pl-4">
                  <div className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-[#18181B]" />
                  <div className="font-bold text-sm text-[#18181B]">Thrissur Central Bus Terminal</div>
                  <div className="text-[11px] text-[#6E6D66]">Origin Stop · KSRTC Depot Central</div>
                </div>

                <div className="relative pl-4">
                  <div className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-[#E5E0D6] border border-[#18181B]" />
                  <div className="font-bold text-sm text-[#18181B]">Puzhakkal Junction / Amala Stand</div>
                  <div className="text-[11px] text-[#6E6D66]">Intermediate Boarding Point · 8 km</div>
                </div>

                <div className="relative pl-4">
                  <div className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-[#E5E0D6] border border-[#18181B]" />
                  <div className="font-bold text-sm text-[#18181B]">Kecheri Bus Shelter</div>
                  <div className="text-[11px] text-[#6E6D66]">Intermediate Boarding Point · 20 km</div>
                </div>

                <div className="relative pl-4">
                  <div className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-[#23533D]" />
                  <div className="font-bold text-sm text-[#18181B]">Kunnamkulam Municipal Bus Stand</div>
                  <div className="text-[11px] text-[#6E6D66]">Destination Terminal · 34 km total</div>
                </div>
              </div>
            </div>

            {/* Permitted Fleet Rules */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-[#18181B]">
                Permitted Fleets & Concession Fare Rules
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="font-bold text-[#18181B] block">KSRTC Ordinary (FP)</span>
                  <span className="text-[11px] text-emerald-800 font-semibold">100% Covered (Zero Fare)</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="font-bold text-[#18181B] block">Fast Passenger (LS)</span>
                  <span className="text-[11px] text-[#23533D] font-semibold">80% Subsidized (Nominal)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Official Transit Regulation:</strong> Passes are valid Monday through Saturday during official academic hours (06:00 to 20:00). Students must present dynamic QR or print certificate upon conductor inspection.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Scan Audit Ledger (On-Bus Conductor Inspections) */}
        {activeTab === 'history' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-[#18181B]">
                    On-Bus Conductor Scan Ledger
                  </h3>
                  <p className="text-[11px] text-[#6E6D66]">
                    Real-time logs of offline ticket inspections conducted on state transport buses
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#23533D]">
                  <History className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3 divide-y divide-[#E5E0D6]/60">
                {inspectionHistory.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#23533D] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-[#18181B] text-xs sm:text-sm">
                          {item.busNo}
                        </div>
                        <div className="text-[11px] text-[#6E6D66] mt-0.5">{item.route}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {item.conductor} · {item.depot}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        {item.latency}
                      </span>
                      <div className="text-[10px] text-[#6E6D66] mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Cryptographic Provenance & Security Information */}
        {activeTab === 'security' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
              <h3 className="font-display font-bold text-base text-[#18181B] mb-2">
                Asymmetric Cryptographic Security
              </h3>
              <p className="text-[#6E6D66] leading-relaxed mb-4">
                EduPass uses military-grade Ed25519 elliptic curve signatures and time-synchronized HMAC-SHA256 seeds to protect against counterfeits.
              </p>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="text-[10px] text-[#6E6D66] block font-sans uppercase font-bold">
                    Canonical Data Payload
                  </span>
                  <p className="text-[#18181B] break-all mt-1">{pass.credential}</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="text-[10px] text-[#6E6D66] block font-sans uppercase font-bold">
                    Ed25519 Sovereign Signature
                  </span>
                  <p className="text-[#23533D] font-bold break-all mt-1">{pass.signature}</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                  <span className="text-[10px] text-[#6E6D66] block font-sans uppercase font-bold">
                    Conductor Offline Public Key
                  </span>
                  <p className="text-zinc-700 break-all mt-1">
                    fda6e8bd3a571660c18d9633e7902d1d03c6218d6e7bf791fcab1d0df9f78ad5
                  </p>
                </div>
              </div>
            </div>

            {/* Helpline & Official Gazette */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B]">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#18181B]">KSRTC Concession Helpline</div>
                  <div className="text-[11px] text-[#6E6D66]">Toll-Free: 1800-425-4777</div>
                </div>
              </div>

              <a
                href="https://transport.kerala.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#23533D] hover:underline font-mono"
              >
                <span>Gazette 2026/TC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* OFFICIAL PRINT-READY CONCESSION CERTIFICATE MODAL            */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white text-[#18181B] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-300 relative my-auto">
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#23533D]" />
                  <span className="font-display font-bold text-base text-[#18181B]">
                    Student Concession Certificate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintCertificate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Document Box */}
              <div className="border-2 border-stone-800 p-5 rounded-2xl bg-[#FAF7F2] font-sans text-xs relative overflow-hidden">
                {/* Official Crest Header */}
                <div className="text-center border-b border-stone-400 pb-3 mb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-stone-600 block">
                    GOVERNMENT OF KERALA · MOTOR VEHICLES DEPARTMENT
                  </span>
                  <h2 className="font-display font-bold text-lg text-stone-900 mt-0.5">
                    KERALA STATE ROAD TRANSPORT CORPORATION
                  </h2>
                  <p className="text-[11px] text-stone-600">
                    CENTRAL STUDENT TRAVEL CONCESSION AUTHORITY SLIP · 2026
                  </p>
                </div>

                {/* Certificate Number & Issue */}
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 mb-4">
                  <span>REG: <strong>{pass.id}</strong></span>
                  <span>ISSUED: <strong>{issuedDate.toLocaleDateString('en-IN')}</strong></span>
                  <span>VALID TILL: <strong>{validDate.toLocaleDateString('en-IN')}</strong></span>
                </div>

                {/* Student Particulars & QR row */}
                <div className="flex items-start gap-4 mb-4 bg-white p-3.5 rounded-xl border border-stone-300">
                  <div className="flex-1 space-y-1 text-[11px]">
                    <div>
                      <span className="text-stone-500 uppercase text-[9px] block">Student Name</span>
                      <strong className="text-sm font-display text-stone-900">{pass.name}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase text-[9px] block">Institution</span>
                      <span className="text-stone-800 font-medium">{pass.institution}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase text-[9px] block">Enrolment Number</span>
                      <span className="font-mono font-bold text-stone-800">{pass.enrolmentNo}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase text-[9px] block">Authorized Corridor</span>
                      <span className="font-bold text-[#23533D]">Thrissur Central ↔ Kunnamkulam (34 km)</span>
                    </div>
                  </div>

                  {/* QR Stamp */}
                  <div className="text-center shrink-0">
                    <div className="p-1.5 bg-white border border-stone-400 rounded-lg">
                      <DynamicQR
                        credential={pass.credential}
                        signatureHex={pass.signature}
                        seedHex={pass.seed}
                        size={84}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-stone-500 mt-1 block">Ed25519 Seal</span>
                  </div>
                </div>

                {/* Rules & Concession Table */}
                <div className="mb-4 text-[10px] text-stone-600 space-y-1">
                  <p>• <strong>Ordinary Services:</strong> 100% Free Travel on authorized route during academic hours.</p>
                  <p>• <strong>Fast Passenger:</strong> 80% Tariff Concession applicable under Kerala Gazette Order 2026/TC.</p>
                  <p>• Valid for bonafide students upon presentation along with institutional photo ID.</p>
                </div>

                {/* Official Signatures Row */}
                <div className="pt-3 border-t border-stone-400 flex items-end justify-between text-center text-[10px]">
                  <div>
                    <div className="font-mono text-stone-400 text-[8px] mb-1">DIGITALLY VERIFIED</div>
                    <div className="font-bold text-stone-800">Principal / Dean</div>
                    <div className="text-[9px] text-stone-500">Government Eng. College</div>
                  </div>

                  <div className="text-stone-400 text-lg font-serif italic">
                    [Seal of KSRTC]
                  </div>

                  <div>
                    <div className="font-mono text-stone-400 text-[8px] mb-1">ED25519 SIGNED</div>
                    <div className="font-bold text-stone-800">Zonal Officer</div>
                    <div className="text-[9px] text-stone-500">KSRTC Concession Cell</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Close Certificate Window
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* GRIEVANCE & BUS DISPUTE REPORTING MODAL                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showGrievance && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white text-[#18181B] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="font-display font-bold text-base text-[#18181B]">
                    Student Transit Grievance Cell
                  </h3>
                </div>
                <button
                  onClick={() => setShowGrievance(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {grievanceSubmittedId ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#23533D] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#18181B]">
                    Grievance Registered
                  </h4>
                  <p className="font-mono text-xs font-bold text-emerald-700 mt-1">
                    Ticket #{grievanceSubmittedId}
                  </p>
                  <p className="font-sans text-xs text-[#6E6D66] mt-2">
                    Escalated directly to KSRTC Depot Inspector Thrissur. Resolution guaranteed within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-4 font-sans text-xs">
                  <p className="text-[#6E6D66] leading-relaxed">
                    Experiencing conductor dispute, offline scanner failure, or bus route denial? Submit an immediate official report:
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                      Issue Category
                    </label>
                    <select className="w-full p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-[#18181B] focus:outline-hidden focus:border-[#18181B]">
                      <option>Conductor Refused Concession Pass</option>
                      <option>Conductor Device Failed to Scan Dynamic QR</option>
                      <option>Bus Skipped Designated Student Stop</option>
                      <option>Lost Device / Replacement Pass Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                      Bus Registration / Route Details
                    </label>
                    <input
                      type="text"
                      defaultValue="KL-15-A-4481 · Route 402"
                      className="w-full p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                      Description of Incident
                    </label>
                    <textarea
                      rows={3}
                      value={grievanceText}
                      onChange={(e) => setGrievanceText(e.target.value)}
                      placeholder="Briefly state what occurred during your transit journey..."
                      required
                      className="w-full p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGrievance(false)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
                    >
                      Submit Official Grievance
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* FULLSCREEN QR SCANNER OVERLAY MODAL                          */}
      {/* Maximum screen brightness & contrast for crowded bus scans   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isFullscreenQR && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Top exit button */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={() => setIsFullscreenQR(false)}
                className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
              >
                <Minimize2 className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center text-white mb-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-bold block">
                MAXIMUM BRIGHTNESS MODE
              </span>
              <h2 className="font-display text-2xl font-bold mt-1">Present to Bus Conductor</h2>
              <p className="font-sans text-xs text-zinc-400 mt-0.5">
                {pass.name} · {pass.id} · Thrissur ↔ Kunnamkulam
              </p>
            </div>

            {/* Huge QR Code */}
            <div className="p-6 bg-white rounded-3xl shadow-2xl">
              <DynamicQR
                credential={pass.credential}
                signatureHex={pass.signature}
                seedHex={pass.seed}
                size={280}
              />
            </div>

            <div className="mt-6 text-center text-zinc-400 font-mono text-xs">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>HMAC Token Active · Auto-Rotates Every 30s</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                Tap anywhere outside or click close to return
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* TOAST NOTIFICATION POPUP                                     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#18181B] text-white text-xs font-sans font-semibold shadow-2xl border border-zinc-700 flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
