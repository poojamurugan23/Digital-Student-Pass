// ============================================================
// EduPass — Unified Public Transport Student Concession System
// Multi-State Public Transport Directorate (KSRTC, TNSTC, BMTC, APSRTC, MSRTC)
// Matches PDF Page 1: Hero Track Search, 3-Step "How It Works",
// "Student Dashboard Preview", Multi-RTC Matrix, & Digital QR Innovation
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  CreditCard,
  Bus,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  QrCode,
  Download,
  Check,
} from 'lucide-react';
import Header from '../components/Header';
import DynamicQR from '../components/DynamicQR';
import { passes } from '../lib/data-store';

export default function Landing() {
  const navigate = useNavigate();
  const demoPass = passes[0]; // Active pass for Pooja M
  const [trackQuery, setTrackQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackQuery.trim())}`);
    } else {
      navigate('/track');
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white">
      <Header />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* HERO SECTION (Matches Reference PDF Page 1)                  */}
        {/* Left: Title, Description, CTAs | Right: Track Application    */}
        {/* ============================================================ */}
        <section className="pt-12 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Title, Subtitle, & Primary CTA */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#E5E0D6] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#23533D] animate-pulse" />
                <span className="text-[11px] font-sans font-semibold tracking-wide text-[#6E6D66]">
                  Unified Public Transport Concession Directorate
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.12]">
                Student Concession <br />
                <span className="text-[#23533D]">Travel Pass Portal</span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#6E6D66] max-w-xl leading-relaxed">
                Get your student travel concession pass online without the hassle of paperwork,
                long queues, and depot visits. Endorsed across state transport corporations with
                instant digital verification.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-sans">
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-[#2B2B30] active:scale-98 transition-all shadow-sm cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Go to Dashboard</span>
                </Link>

                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#E5E0D6] text-[#18181B] text-xs font-semibold hover:bg-[#FAF7F2] active:scale-98 transition-all shadow-2xs cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#6E6D66]" />
                  <span>Track Application</span>
                </Link>

                <Link
                  to="/student/apply"
                  className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-[#EAF0EC] border border-[#23533D]/20 text-[#23533D] text-xs font-bold hover:bg-[#dfe9e2] active:scale-98 transition-all cursor-pointer"
                >
                  <span>Apply Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Supported Multi-State RTC Indicators */}
              <div className="pt-4 border-t border-[#E5E0D6] flex items-center gap-3 text-xs font-sans text-[#6E6D66]">
                <span className="font-bold text-[#18181B]">Active Networks:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['KSRTC (Kerala)', 'TNSTC (Tamil Nadu)', 'BMTC (Karnataka)', 'APSRTC (Andhra)', 'MSRTC (Maharashtra)'].map((rtc) => (
                    <span
                      key={rtc}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#E5E0D6] text-[10px] font-mono text-stone-700"
                    >
                      {rtc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Track Your Application Card (Matches PDF Page 1) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-8 shadow-xl relative overflow-hidden font-sans">
                {/* Iridescent Accent Strip */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-[#23533D]" />

                <div className="mb-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#23533D] font-bold block">
                    Instant Status Tracker
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#18181B] mt-0.5">
                    Track Your Application
                  </h3>
                  <p className="text-xs text-[#6E6D66] mt-1">
                    Enter your Application ID or registered mobile number to check two-tier approval status:
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#18181B] uppercase tracking-wider mb-1.5">
                      Application ID / Mobile Number
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#6E6D66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={trackQuery}
                        onChange={(e) => setTrackQuery(e.target.value)}
                        placeholder="e.g. KSRTC-2026-18742 or 9876543210"
                        className="w-full pl-10 pr-3.5 py-3 text-xs bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] outline-none text-[#18181B] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#18181B] hover:bg-stone-800 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Now</span>
                  </button>

                  {/* Sample search queries */}
                  <div className="pt-2 text-[10px] text-stone-500 space-y-1">
                    <span className="block font-semibold text-stone-700">Quick Test References:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate('/track?id=KSRTC-2026-18742')}
                        className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5E0D6] hover:border-stone-800 text-stone-700 transition-colors"
                      >
                        Archana (Depot Approved)
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/track?id=APP-003')}
                        className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5E0D6] hover:border-stone-800 text-stone-700 transition-colors"
                      >
                        Pooja (Pass Issued)
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* HOW IT WORKS (3 Simple Steps — Matches PDF Page 1)           */}
        {/* 1. Student Application -> 2. Verification -> 3. Payment/Pass */}
        {/* ============================================================ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E5E0D6]">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#23533D] font-bold block">
              Streamlined Three-Tier Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#18181B] mt-1">
              How It Works
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1.5 max-w-lg mx-auto">
              Get your student travel concession pass in three simple transparent steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans relative">
            {/* Connecting Step Lines (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-[#E5E0D6] -z-0" />

            {/* Step 1: Student Application */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs text-center relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#18181B] text-white flex items-center justify-center font-display font-bold text-lg mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-display font-bold text-base text-[#18181B] mb-2">
                Student Application
              </h3>
              <p className="text-xs text-[#6E6D66] leading-relaxed">
                Register and submit your online application with student particulars, authorized
                corridor route, and bonafide institutional documents.
              </p>
            </div>

            {/* Step 2: Verification Process */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs text-center relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#23533D] text-white flex items-center justify-center font-display font-bold text-lg mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-display font-bold text-base text-[#18181B] mb-2">
                Verification Process
              </h3>
              <p className="text-xs text-[#6E6D66] leading-relaxed">
                Your college registrar verifies academic enrollment, followed by the regional transport
                depot approving the corridor route and tariff tier.
              </p>
            </div>

            {/* Step 3: Payment & Delivery */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs text-center relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-display font-bold text-lg mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-display font-bold text-base text-[#18181B] mb-2">
                Payment & Delivery
              </h3>
              <p className="text-xs text-[#6E6D66] leading-relaxed">
                Make the nominal administrative fee payment online and receive your official digital
                concession pass instantly with downloadable certificate.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STUDENT DASHBOARD PREVIEW SECTION (Matches PDF Page 1)       */}
        {/* Status Stepper, Concession Details, Quick Actions             */}
        {/* ============================================================ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E5E0D6]">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#23533D] font-bold block">
              Passenger Experience
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#18181B] mt-1">
              Student Dashboard Preview
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1 max-w-lg mx-auto">
              Track your application status and manage your concession pass with complete ease.
            </p>
          </div>

          {/* Interactive Mock Dashboard Window (Matches PDF Page 1 card) */}
          <div className="bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-8 shadow-xl font-sans">
            {/* Card Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D6] mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#23533D]" />
                <span className="font-display font-bold text-base text-[#18181B]">
                  Student Dashboard
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF0EC] text-[#23533D] text-[10px] font-mono font-bold">
                Student Profile Active
              </span>
            </div>

            {/* 3-Column Layout from PDF Page 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Column 1: Application Status (4 cols) */}
              <div className="md:col-span-4 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Application Status
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-sm font-display text-[#18181B] block">
                        College Verification
                      </strong>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200">
                  <div className="flex justify-between text-[9px] font-mono text-stone-500 mb-1">
                    <span>Submitted</span>
                    <span className="font-bold text-[#23533D]">College Verified</span>
                    <span>Depot Approved</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="w-2/5 h-full bg-[#23533D] rounded-full" />
                  </div>
                </div>

                <Link
                  to="/track?id=KSRTC-2026-18742"
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#23533D] hover:underline"
                >
                  <span>View full details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Column 2: Concession Details (5 cols) */}
              <div className="md:col-span-5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] space-y-2 text-xs">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-200">
                  <Bus className="w-4 h-4 text-[#23533D]" />
                  <span className="font-bold text-sm text-[#18181B]">Concession Details</span>
                </div>

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Application ID:</span>
                  <strong className="font-mono text-[#18181B]">KSRTC-2026-18742</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Travel Route:</span>
                  <span className="font-semibold text-[#18181B]">Thrissur to Kochi</span>
                </div>

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Applied Date:</span>
                  <span className="text-stone-700">15 Aug 2026</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-stone-500">College:</span>
                  <span className="font-semibold text-[#18181B] truncate max-w-[170px]">
                    Govt. Engineering College, Thrissur
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    to="/student/apply"
                    className="text-[11px] font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Edit application ➔
                  </Link>
                </div>
              </div>

              {/* Column 3: Quick Actions (3 cols) */}
              <div className="md:col-span-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] flex flex-col justify-center space-y-2.5">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block text-center mb-1">
                  Quick Actions
                </span>

                <Link
                  to="/track?id=KSRTC-2026-18742"
                  className="w-full py-2 px-3 rounded-xl bg-[#23533D] hover:bg-[#1b4230] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
                >
                  Submit Payment Details
                </Link>

                <Link
                  to="/student/pass"
                  className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5E0D6] hover:border-stone-400 text-stone-800 text-[11px] font-semibold text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </Link>

                <Link
                  to="/student/dashboard"
                  className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5E0D6] hover:border-stone-400 text-stone-800 text-[11px] font-semibold text-center transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DIGITAL QR INNOVATION FEATURE (Practical & Permanent)        */}
        {/* As requested: QR as an additional innovation feature          */}
        {/* ============================================================ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E5E0D6]">
          <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#E5E0D6] shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 font-sans text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0EC] text-[#23533D] text-[10px] font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ADDITIONAL INNOVATION FEATURE</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
                Sovereign Digital QR Pass
              </h3>

              <p className="text-xs sm:text-sm text-[#6E6D66] leading-relaxed">
                While retaining standard printed certificates, EduPass introduces cryptographic
                QR passes that bus conductors verify in under 3.4ms even on offline rural routes.
                Built with permanent asymmetric Ed25519 signatures so students never face expired-screen
                delays on moving buses.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-4 h-4" />
                  <span>No 30-Second Timeout Panic</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-4 h-4" />
                  <span>Works in Airplane Mode</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/student/pass"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>View Sovereign Pass Demo</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] shadow-sm text-center">
                {demoPass && (
                  <DynamicQR
                    credential={demoPass.credential}
                    signatureHex={demoPass.signature}
                    seedHex={demoPass.seed}
                    size={160}
                  />
                )}
                <span className="text-[10px] font-mono text-stone-500 block mt-2">
                  Ed25519 Cryptographic Seal
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER (Matches Reference PDF Page 1)                        */}
      {/* KSRTC Concession, Quick Links, Contact Us, Newsletter        */}
      {/* ============================================================ */}
      <footer className="bg-white border-t border-[#E5E0D6] pt-12 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand & Description (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#18181B] flex items-center justify-center text-white text-xs font-bold font-display">
                E
              </div>
              <span className="font-display font-bold text-lg text-[#18181B]">
                Public Transport Concession
              </span>
            </div>
            <p className="text-xs text-[#6E6D66] leading-relaxed max-w-sm">
              Streamlining student transport concessions through our digital platform, making travel
              more accessible and accountable for students across state transport networks.
            </p>
            <div className="text-[11px] text-stone-400 font-mono">
              Interoperable State Transit Protocol
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-[#6E6D66]">
              <li><Link to="/" className="hover:text-[#18181B] transition-colors">Home</Link></li>
              <li><Link to="/track" className="hover:text-[#18181B] transition-colors">Track Status</Link></li>
              <li><Link to="/analytics" className="hover:text-[#18181B] transition-colors">Analytics</Link></li>
              <li><Link to="/student/apply" className="hover:text-[#18181B] transition-colors">Apply Online</Link></li>
              <li><Link to="/student/pass" className="hover:text-[#18181B] transition-colors">Digital Pass</Link></li>
              <li><Link to="/login" className="hover:text-[#18181B] transition-colors">Login / Register</Link></li>
            </ul>
          </div>

          {/* Contact Us (3 cols) */}
          <div className="md:col-span-3 space-y-2.5 text-xs text-[#6E6D66]">
            <h4 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">Contact Us</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>Transport Bhavan, Fort P.O., Thiruvananthapuram, Kerala 695023</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
              <span>+91 0471-2463799 / 1800-425-4777</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <span>support@ksrtc.kerala.gov.in</span>
            </p>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-[#6E6D66]">
              Subscribe to our newsletter for the latest updates and transport concession guidelines.
            </p>

            <form onSubmit={handleNewsletter} className="flex items-center gap-1.5 pt-1">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-xs text-[#18181B] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {newsletterSubscribed && (
              <span className="text-[11px] text-emerald-700 font-semibold block">
                ✓ Subscribed to official updates.
              </span>
            )}
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#E5E0D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6E6D66]">
          <div>© 2026 Public Transport Concession Directorate. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
