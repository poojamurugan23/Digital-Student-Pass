// ============================================================
// EduPass — Official Application Tracking Portal
// Reference: Multi-Stage Transit Concession Verification Workflow
// Matches PDF Page 6: Stepper, Status Lifecycle, Payment & Pass Issuance
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  CreditCard,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import Header from '../components/Header';
import { applications, findApplicationByQuery } from '../lib/data-store';
import type { StudentApplication } from '../lib/types';

export default function TrackApplication() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('q') || 'KSRTC-2026-18742';

  const [query, setQuery] = useState(initialQuery);
  const [activeApp, setActiveApp] = useState<StudentApplication | null>(() => {
    return findApplicationByQuery(initialQuery) || applications[0] || null;
  });
  const [searched, setSearched] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = findApplicationByQuery(query);
    setActiveApp(found || null);
    setSearched(true);
  };

  const handleSimulatePayment = () => {
    if (!activeApp) return;
    activeApp.payment = {
      amount: 120,
      status: 'PAID',
      paymentId: `PAY-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: Math.floor(Date.now() / 1000),
      method: `${paymentMethod} · Instant Gateway`,
    };
    activeApp.status = 'APPROVED';
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 2000);
  };

  // Determine active step index (0 to 4)
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'PENDING':
        return 0;
      case 'COLLEGE_VERIFIED':
        return 1;
      case 'DEPOT_APPROVED':
      case 'PAYMENT_PENDING':
        return 2;
      case 'PAYMENT_COMPLETED':
        return 3;
      case 'APPROVED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = activeApp ? getStepIndex(activeApp.status) : 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 pt-8 pb-12 w-full">
        {/* Page Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E6D66] font-bold block">
            National Public Transport Student Concession Portal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight mt-1">
            Application Tracking
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1 max-w-md mx-auto">
            Track real-time multi-tier verification across your College Registrar, Transport Depot, and Concession Cell.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-4 sm:p-5 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6E6D66] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Application ID (e.g. KSRTC-2026-18742) or Mobile..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-xs font-sans text-[#18181B] placeholder:text-stone-400 focus:outline-hidden focus:border-[#18181B] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-stone-800 active:scale-98 transition-all cursor-pointer shadow-sm"
            >
              Track Now
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-sans text-[#6E6D66]">
            <span>Try demo references:</span>
            {[
              { label: 'Archana (Depot Approved)', id: 'KSRTC-2026-18742' },
              { label: 'Pooja (Pass Issued)', id: 'APP-003' },
              { label: 'Karthik (College Verified)', id: 'TNSTC-2026-0419' },
              { label: 'Priya (BMTC Submitted)', id: 'BMTC-2026-3120' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setQuery(chip.id);
                  const found = findApplicationByQuery(chip.id);
                  setActiveApp(found || null);
                  setSearched(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5E0D6] hover:border-[#18181B] text-[#18181B] transition-colors cursor-pointer text-[10px]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Application Result View */}
        {activeApp ? (
          <div className="space-y-6">
            {/* Top Status Banner */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E6D66] font-bold">
                    Application Status
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5E0D6] font-bold text-stone-700">
                    {activeApp.applicationNo || activeApp.id}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#18181B] mt-1 flex items-center gap-2">
                  <span>
                    {activeApp.status === 'APPROVED'
                      ? 'Concession Pass Issued'
                      : activeApp.status === 'DEPOT_APPROVED'
                      ? 'Depot Approved · Awaiting Payment'
                      : activeApp.status === 'COLLEGE_VERIFIED'
                      ? 'College Verified · Forwarded to Depot'
                      : 'Application Submitted'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      activeApp.status === 'APPROVED'
                        ? 'bg-emerald-500 animate-pulse'
                        : activeApp.status === 'DEPOT_APPROVED'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-blue-500'
                    }`}
                  />
                </h2>
                <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
                  {activeApp.name} · {activeApp.institution}
                </p>
              </div>

              {/* Top CTA depending on status */}
              <div>
                {activeApp.status === 'DEPOT_APPROVED' || activeApp.status === 'PAYMENT_PENDING' ? (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#23533D] text-white text-xs font-sans font-bold hover:bg-[#1b4230] active:scale-98 transition-all cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Submit Payment (₹120)</span>
                  </button>
                ) : activeApp.status === 'APPROVED' ? (
                  <Link
                    to="/student/pass"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-sans font-bold hover:bg-stone-800 active:scale-98 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Open Digital Pass</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>In Progress</span>
                  </span>
                )}
              </div>
            </div>

            {/* Visual 5-Stage Stepper (Reference: PDF Page 6) */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 sm:p-6 shadow-sm font-sans">
              <h3 className="font-display font-bold text-sm text-[#18181B] mb-5">
                Verification & Issuance Lifecycle
              </h3>

              {/* Stepper Bar */}
              <div className="relative">
                {/* Connecting Background Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                {/* Active Progress Line */}
                <div
                  className="absolute top-4 left-6 h-0.5 bg-[#23533D] -z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 90}%` }}
                />

                {/* 5 Step Icons */}
                <div className="grid grid-cols-5 text-center relative z-10">
                  {[
                    { label: 'Submitted', sub: 'Student App' },
                    { label: 'College Verification', sub: 'Registrar Seal' },
                    { label: 'Depot Approval', sub: 'Transport Officer' },
                    { label: 'Payment', sub: 'Concession Fee' },
                    { label: 'Pass Issued', sub: 'Active Credential' },
                  ].map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isDone
                              ? 'bg-[#23533D] text-white'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-[#23533D]/20 scale-110' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-bold mt-2 block leading-tight ${
                            isDone ? 'text-[#18181B]' : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[9px] text-stone-400 hidden sm:block mt-0.5">
                          {step.sub}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Explanation Note */}
              <div className="mt-6 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-xs text-stone-700 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#23533D] shrink-0 mt-0.5" />
                <div>
                  {activeApp.status === 'SUBMITTED' && (
                    <span>
                      Your application has been received and is pending document verification by{' '}
                      <strong>{activeApp.institution}</strong>.
                    </span>
                  )}
                  {activeApp.status === 'COLLEGE_VERIFIED' && (
                    <span>
                      Your college has endorsed your enrolment. Application forwarded to{' '}
                      <strong>{activeApp.depot || 'Regional Transport Depot'}</strong> for corridor route approval.
                    </span>
                  )}
                  {activeApp.status === 'DEPOT_APPROVED' && (
                    <span>
                      Route <strong>{activeApp.origin} ↔ {activeApp.destination}</strong> approved by depot officer!
                      Please submit the nominal semester pass fee of ₹120 to activate your sovereign pass.
                    </span>
                  )}
                  {activeApp.status === 'APPROVED' && (
                    <span>
                      Concession pass is active and digitally signed with Ed25519 cryptography. You may present the digital pass
                      or carry the printed authority certificate.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Two-Column Details & Timeline Cards (Matching PDF Page 6) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              {/* Card 1: Application Details */}
              <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h3 className="font-display font-bold text-sm text-[#18181B]">
                    Application Particulars
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-600 font-semibold border border-[#E5E0D6]">
                    {activeApp.transportOperator} · {activeApp.state || 'Kerala'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Travel Route:</span>
                    <strong className="text-[#18181B] text-right font-medium">
                      {activeApp.origin} ➔ {activeApp.destination}
                    </strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Application Type:</span>
                    <span className="font-medium text-[#18181B]">Academic Semester Pass</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Educational College:</span>
                    <span className="font-medium text-[#18181B] text-right truncate max-w-[200px]">
                      {activeApp.institution}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Operating Depot:</span>
                    <span className="font-medium text-[#18181B]">{activeApp.depot || 'Central Depot'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Student Roll / Enrolment:</span>
                    <span className="font-mono font-bold text-[#18181B]">{activeApp.enrolmentNo}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Date of Submission:</span>
                    <span className="text-stone-700">
                      {new Date(activeApp.submittedAt * 1000).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Current Status:</span>
                    <span className="font-bold text-[#23533D]">{activeApp.status}</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  {activeApp.status === 'DEPOT_APPROVED' ? (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full py-2.5 rounded-xl bg-[#23533D] hover:bg-[#1b4230] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Submit Payment Details (₹120)</span>
                    </button>
                  ) : activeApp.status === 'APPROVED' ? (
                    <Link
                      to="/student/pass"
                      className="w-full py-2.5 rounded-xl bg-[#18181B] hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 text-center"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Download / View Concession Pass</span>
                    </Link>
                  ) : (
                    <div className="text-center py-2 text-stone-400 text-xs italic">
                      Awaiting administrative clearance
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Application Timeline (Matching PDF Page 6) */}
              <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-[#18181B] border-b border-stone-100 pb-2">
                  Application Audit Timeline
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Event 1: Submission */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#23533D] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#18181B] block">Application Submitted</strong>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {new Date(activeApp.submittedAt * 1000).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Uploaded credentials & photo identity successfully to cloud registry.
                      </p>
                    </div>
                  </div>

                  {/* Event 2: College Verification */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                        currentStep >= 1
                          ? 'bg-emerald-100 text-[#23533D]'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {currentStep >= 1 ? '✓' : '2'}
                    </div>
                    <div>
                      <strong className={currentStep >= 1 ? 'text-[#18181B]' : 'text-stone-400'}>
                        College Verification Completed
                      </strong>
                      {activeApp.collegeVerifiedAt && (
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {new Date(activeApp.collegeVerifiedAt * 1000).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {activeApp.collegeRemarks ||
                          'Verified bona fide student registration by institutional authority.'}
                      </p>
                    </div>
                  </div>

                  {/* Event 3: Depot Approval */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                        currentStep >= 2
                          ? 'bg-emerald-100 text-[#23533D]'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {currentStep >= 2 ? '✓' : '3'}
                    </div>
                    <div>
                      <strong className={currentStep >= 2 ? 'text-[#18181B]' : 'text-stone-400'}>
                        Transport Depot Approval
                      </strong>
                      {activeApp.depotApprovedAt && (
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {new Date(activeApp.depotApprovedAt * 1000).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {activeApp.depotRemarks ||
                          'Corridor route validated. Concession tariff tier authorized.'}
                      </p>
                    </div>
                  </div>

                  {/* Event 4: Pass Issuance */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                        currentStep >= 4
                          ? 'bg-emerald-100 text-[#23533D]'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {currentStep >= 4 ? '✓' : '4'}
                    </div>
                    <div>
                      <strong className={currentStep >= 4 ? 'text-[#18181B]' : 'text-stone-400'}>
                        Sovereign Concession Pass Issued
                      </strong>
                      {activeApp.approvedAt && (
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {new Date(activeApp.approvedAt * 1000).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Asymmetric Ed25519 signature generated. Digital pass active on offline conductor roster.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : searched ? (
          <div className="bg-white rounded-2xl border border-[#E5E0D6] p-8 text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg text-[#18181B]">Application Not Found</h3>
            <p className="font-sans text-xs text-[#6E6D66] mt-1 max-w-sm mx-auto">
              No concession application matched "{query}". Please check your Application ID or registered mobile number.
            </p>
          </div>
        ) : null}
      </main>

      {/* ============================================================ */}
      {/* SIMULATED PAYMENT MODAL                                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showPaymentModal && activeApp && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-300 relative text-[#18181B]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#23533D]" />
                  <h3 className="font-display font-bold text-base text-[#18181B]">
                    Student Concession Pass Fee
                  </h3>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {paymentSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#23533D] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#18181B]">
                    Payment Successful!
                  </h4>
                  <p className="font-mono text-xs font-bold text-emerald-700 mt-1">
                    Receipt #{activeApp.payment?.paymentId}
                  </p>
                  <p className="font-sans text-xs text-[#6E6D66] mt-2">
                    Concession pass is now active and signed. Redirecting...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs">
                  {/* Order Summary */}
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Applicant:</span>
                      <strong>{activeApp.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Corridor Route:</span>
                      <span>{activeApp.origin} ➔ {activeApp.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Validity:</span>
                      <span>Full Academic Semester (90 Days)</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                      <strong>Concession Fee Payable:</strong>
                      <strong className="text-[#23533D] font-mono">₹120.00</strong>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#18181B] mb-1.5">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['UPI', 'Card', 'NetBanking'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                            paymentMethod === method
                              ? 'border-[#18181B] bg-[#18181B] text-white shadow-xs'
                              : 'border-[#E5E0D6] bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900">
                      Supports Google Pay, PhonePe, Paytm, and BHIM UPI handles. Instant approval.
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      className="px-5 py-2.5 rounded-xl bg-[#23533D] hover:bg-[#1b4230] text-white font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Pay ₹120 & Activate Pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
