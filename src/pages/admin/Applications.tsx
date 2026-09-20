// ============================================================
// EduPass — Public Transport Depot Officer Dashboard
// Reference: Matches PDF Page 7 (Metric Cards, Tab Filters,
// Applications Table, Action Handlers & Quick Actions Sidebar)
// Supports all state RTCs: KSRTC, TNSTC, BMTC, APSRTC, MSRTC
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Search,
  CheckCircle2,
  Building2,
  Filter,
  X,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import Header from '../../components/Header';
import {
  applications,
  passes,
  DEMO_PRIVATE_KEY,
} from '../../lib/data-store';
import {
  signCredential,
  serializeCredential,
  generateSeed,
  hashPhoto,
} from '../../lib/crypto';
import { syncPassToSupabase, updateApplicationInSupabase } from '../../lib/supabase';
import type { StudentApplication, Pass } from '../../lib/types';

export default function AdminApplications() {
  const [appList, setAppList] = useState<StudentApplication[]>([...applications]);
  const [activeTab, setActiveTab] = useState<'pending' | 'payment' | 'ready' | 'issued'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Counts for top 4 metric cards (Matches PDF Page 7)
  const pendingApprovalsCount = appList.filter(
    (a) => a.status === 'COLLEGE_VERIFIED' || a.status === 'SUBMITTED' || a.status === 'PENDING'
  ).length;

  const paymentVerificationCount = appList.filter(
    (a) => a.status === 'DEPOT_APPROVED' || a.status === 'PAYMENT_PENDING'
  ).length;

  const readyToIssueCount = appList.filter(
    (a) => a.status === 'PAYMENT_COMPLETED' || (a.status === 'DEPOT_APPROVED' && a.payment?.status === 'PAID')
  ).length;

  const issuedCount = appList.filter((a) => a.status === 'APPROVED').length;

  // Filter applications by tab
  const getTabFilteredApps = () => {
    switch (activeTab) {
      case 'pending':
        return appList.filter(
          (a) => a.status === 'COLLEGE_VERIFIED' || a.status === 'SUBMITTED' || a.status === 'PENDING'
        );
      case 'payment':
        return appList.filter(
          (a) => a.status === 'DEPOT_APPROVED' || a.status === 'PAYMENT_PENDING'
        );
      case 'ready':
        return appList.filter(
          (a) => a.status === 'PAYMENT_COMPLETED' || (a.status === 'DEPOT_APPROVED' && a.payment?.status === 'PAID')
        );
      case 'issued':
        return appList.filter((a) => a.status === 'APPROVED');
      default:
        return appList;
    }
  };

  // Apply search & operator filters
  const filteredApps = getTabFilteredApps().filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.applicationNo && a.applicationNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOperator =
      operatorFilter === 'ALL' || a.transportOperator.toUpperCase() === operatorFilter.toUpperCase();

    return matchesSearch && matchesOperator;
  });

  // Action: Depot Approves Route Corridor
  const handleApproveCorridor = (app: StudentApplication) => {
    setProcessingId(app.id);
    const nowSec = Math.floor(Date.now() / 1000);

    setTimeout(() => {
      const idx = applications.findIndex((a) => a.id === app.id);
      if (idx !== -1) {
        applications[idx].status = 'DEPOT_APPROVED';
        applications[idx].depotApprovedAt = nowSec;
        applications[idx].depotRemarks = 'Corridor route approved. Concession tariff tier authorized.';
        if (!applications[idx].payment) {
          applications[idx].payment = { amount: 120, status: 'PENDING' };
        }
      }
      setAppList([...applications]);
      setProcessingId(null);
      showToast(`Application ${app.applicationNo || app.id} approved by depot officer.`);
    }, 350);
  };

  // Action: Verify Payment
  const handleVerifyPayment = (app: StudentApplication) => {
    setProcessingId(app.id);
    const nowSec = Math.floor(Date.now() / 1000);

    setTimeout(() => {
      const idx = applications.findIndex((a) => a.id === app.id);
      if (idx !== -1) {
        applications[idx].payment = {
          amount: 120,
          status: 'PAID',
          paymentId: `PAY-REC-${Math.floor(100000 + Math.random() * 900000)}`,
          paidAt: nowSec,
          method: 'Counter / Digital Verification',
        };
        applications[idx].status = 'PAYMENT_COMPLETED';
      }
      setAppList([...applications]);
      setProcessingId(null);
      showToast(`Payment verified for ${app.name}. Application ready for issuance.`);
    }, 350);
  };

  // Action: Issue Sovereign Concession Pass (Ed25519 Signed)
  const handleIssuePass = useCallback(async (app: StudentApplication) => {
    setProcessingId(app.id);

    try {
      const nowSec = Math.floor(Date.now() / 1000);
      const validUntil = nowSec + 90 * 24 * 60 * 60; // 90 days
      const passId = `EP-${String(passes.length + 1).padStart(3, '0')}`;
      const photoHash = hashPhoto(new TextEncoder().encode(`photo-${app.name}`));

      // Canonical payload for Ed25519 signing
      const payload = serializeCredential({
        version: 'v1',
        passId,
        name: app.name,
        institution: app.institution,
        passClass: app.routeClass || 'STUDENT',
        validUntil,
        issuedAt: nowSec,
        photoHash,
      });

      // SIGN with Ed25519 sovereign private key
      const signature = await signCredential(payload, DEMO_PRIVATE_KEY);
      const seed = generateSeed();

      const newPass: Pass = {
        id: passId,
        studentId: app.id,
        credential: payload,
        signature,
        seed,
        validUntil,
        issuedAt: nowSec,
        revoked: false,
        photoHash,
        photoUrl: app.photoUrl,
        name: app.name,
        institution: app.institution,
        passClass: app.routeClass || 'STUDENT',
        enrolmentNo: app.enrolmentNo,
      };

      passes.push(newPass);

      const appIndex = applications.findIndex((a) => a.id === app.id);
      if (appIndex !== -1) {
        applications[appIndex].status = 'APPROVED';
        applications[appIndex].approvedAt = nowSec;
      }

      setAppList([...applications]);
      setSelectedApp(null);
      showToast(`Sovereign Concession Pass ${passId} issued successfully for ${app.name}!`);

      // Cloud synchronization with Supabase
      syncPassToSupabase(newPass).catch((e) => console.warn('Supabase pass sync notice:', e));
      updateApplicationInSupabase(app.id, { status: 'APPROVED', approvedAt: nowSec }).catch((e) =>
        console.warn('Supabase app update notice:', e)
      );
    } catch (err) {
      console.error('Pass issuance failed:', err);
    } finally {
      setProcessingId(null);
    }
  }, []);

  // Action: Reject application
  const handleReject = useCallback((app: StudentApplication) => {
    const rejectedAt = Math.floor(Date.now() / 1000);
    const appIndex = applications.findIndex((a) => a.id === app.id);
    if (appIndex !== -1) {
      applications[appIndex].status = 'REJECTED';
      applications[appIndex].rejectedAt = rejectedAt;
      applications[appIndex].rejectionReason = 'Corridor route exceeds municipal academic limit or invalid ID.';
    }
    setAppList([...applications]);
    setSelectedApp(null);
    showToast(`Application ${app.applicationNo || app.id} rejected.`);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full font-sans">
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            to="/review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6D66] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Operations Hub</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0EC] border border-[#23533D]/20 text-[#23533D] text-[11px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>DEPOT DESK ONLINE · REAL-TIME QUEUE</span>
          </div>
        </div>

        {/* Welcome Header (Matches PDF Page 7) */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#23533D] font-bold">
              Transport Corporation Zonal Office
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E5E0D6] text-stone-600">
              KSRTC / Multi-RTC Network
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] mt-0.5">
            Transport Depot Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] mt-1">
            Welcome, Depot Officer. Review student applications, endorse travel corridors, and issue verifiable digital concession credentials.
          </p>
        </div>

        {/* 4 Stat Cards (Matches PDF Page 7 Top Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Pending Approvals */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Pending Approvals
            </span>
            <div className="font-display text-3xl font-bold text-[#18181B] mt-1">
              {pendingApprovalsCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Applications awaiting depot approval</div>
          </button>

          {/* Card 2: Payment Verification */}
          <button
            onClick={() => setActiveTab('payment')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Payment Verification
            </span>
            <div className="font-display text-3xl font-bold text-amber-700 mt-1">
              {paymentVerificationCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Payments pending verification</div>
          </button>

          {/* Card 3: Ready to Issue */}
          <button
            onClick={() => setActiveTab('ready')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'ready'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Ready to Issue
            </span>
            <div className="font-display text-3xl font-bold text-[#23533D] mt-1">
              {readyToIssueCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Applications ready for issuance</div>
          </button>

          {/* Card 4: Issued */}
          <button
            onClick={() => setActiveTab('issued')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'issued'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Issued
            </span>
            <div className="font-display text-3xl font-bold text-emerald-700 mt-1">
              {issuedCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Concessions active on road</div>
          </button>
        </div>

        {/* Main Workspace: Table on Left + Quick Actions Sidebar on Right (Matches PDF Page 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main Column: Table & Filters (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Filter Tabs Row */}
            <div className="flex items-center p-1 bg-[#EFE9DF] rounded-xl border border-[#E5E0D6] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Pending Approvals ({pendingApprovalsCount})
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'payment'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Payment Verification ({paymentVerificationCount})
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ready'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Ready to Issue ({readyToIssueCount})
              </button>
              <button
                onClick={() => setActiveTab('issued')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'issued'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Issued ({issuedCount})
              </button>
            </div>

            {/* Search & Select Bar (Matches PDF Page 7) */}
            <div className="p-4 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applications by student, ID, or route..."
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-[#18181B] placeholder:text-stone-400 focus:outline-hidden focus:border-[#18181B]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-[#6E6D66]" />
                <select
                  value={operatorFilter}
                  onChange={(e) => setOperatorFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-xs font-semibold text-[#18181B] focus:outline-hidden"
                >
                  <option value="ALL">All Transport Operators</option>
                  <option value="KSRTC">KSRTC (Kerala)</option>
                  <option value="TNSTC">TNSTC (Tamil Nadu)</option>
                  <option value="BMTC">BMTC (Karnataka)</option>
                  <option value="APSRTC">APSRTC (Andhra)</option>
                  <option value="MSRTC">MSRTC (Maharashtra)</option>
                </select>
              </div>
            </div>

            {/* Applications Table (Matches PDF Page 7) */}
            <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-[#E5E0D6]">
                    <tr>
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-4">Route Corridor</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredApps.length > 0 ? (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          {/* Application ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-[#18181B]">
                            {app.applicationNo || app.id}
                            <span className="block text-[10px] font-normal text-stone-500">
                              {app.transportOperator}
                            </span>
                          </td>

                          {/* Student Details */}
                          <td className="py-3.5 px-4">
                            <strong className="text-[#18181B] block">{app.name}</strong>
                            <span className="text-[11px] text-stone-500 truncate block max-w-[200px]">
                              {app.institution}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {app.enrolmentNo}
                            </span>
                          </td>

                          {/* Route */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#18181B] block">
                              {app.origin} ➔ {app.destination}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {app.depot || 'Central Depot'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                app.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : app.status === 'DEPOT_APPROVED'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : app.status === 'COLLEGE_VERIFIED'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                  : 'bg-stone-100 text-stone-700 border-stone-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                            {new Date(app.submittedAt * 1000).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending Depot Approval */}
                              {(app.status === 'COLLEGE_VERIFIED' ||
                                app.status === 'SUBMITTED' ||
                                app.status === 'PENDING') && (
                                <button
                                  onClick={() => handleApproveCorridor(app)}
                                  disabled={processingId === app.id}
                                  className="px-3 py-1.5 rounded-lg bg-[#23533D] hover:bg-[#1b4230] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                                >
                                  {processingId === app.id ? 'Approving...' : 'Approve Corridor'}
                                </button>
                              )}

                              {/* If Payment Verification */}
                              {(app.status === 'DEPOT_APPROVED' || app.status === 'PAYMENT_PENDING') && (
                                <button
                                  onClick={() => handleVerifyPayment(app)}
                                  disabled={processingId === app.id}
                                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                                >
                                  {processingId === app.id ? 'Verifying...' : 'Verify Payment'}
                                </button>
                              )}

                              {/* If Ready to Issue */}
                              {app.status === 'PAYMENT_COMPLETED' && (
                                <button
                                  onClick={() => handleIssuePass(app)}
                                  disabled={processingId === app.id}
                                  className="px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-stone-800 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3 text-emerald-400" />
                                  <span>{processingId === app.id ? 'Signing...' : 'Issue Pass'}</span>
                                </button>
                              )}

                              {/* If Issued */}
                              {app.status === 'APPROVED' && (
                                <Link
                                  to="/student/pass"
                                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E0D6] hover:border-stone-400 text-[#18181B] text-[11px] font-semibold transition-colors flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Pass</span>
                                </Link>
                              )}

                              <button
                                onClick={() => setSelectedApp(app)}
                                title="Inspect Documents"
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-stone-400 text-xs">
                          No applications found in this queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#E5E0D6] flex items-center justify-between text-[11px] text-stone-500 font-sans">
                <span>Showing {filteredApps.length} of {appList.length} applications</span>
                <div className="flex items-center gap-2 font-semibold">
                  <button className="px-2.5 py-1 rounded bg-white border border-[#E5E0D6] text-stone-600 disabled:opacity-50">
                    Previous
                  </button>
                  <span className="px-2 font-mono text-stone-900">1</span>
                  <button className="px-2.5 py-1 rounded bg-white border border-[#E5E0D6] text-stone-600 disabled:opacity-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions Sidebar (Matches PDF Page 7) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs space-y-3 font-sans">
              <h3 className="font-display font-bold text-sm text-[#18181B] pb-2 border-b border-stone-100">
                Quick Actions
              </h3>

              <button
                onClick={() => setActiveTab('pending')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'pending'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Pending Approvals</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {pendingApprovalsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'payment'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Payment Verifications</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {paymentVerificationCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ready')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'ready'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Issue Concessions</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {readyToIssueCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('issued')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'issued'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Approved Concessions</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {issuedCount}
                </span>
              </button>

              <div className="pt-2 border-t border-stone-100">
                <a
                  href="tel:18004254777"
                  className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5E0D6] hover:border-stone-400 text-stone-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#23533D]" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>

            {/* Operating Depot Info Card */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] p-4 text-xs font-sans space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#23533D]" />
                <strong className="text-[#18181B]">Regional Depot Registry</strong>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Authorized under Kerala Motor Vehicles Concession Rules 2026. Ed25519 cryptographic key active on device.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* APPLICATION DETAIL & PROOF INSPECTION MODAL                  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 relative text-[#18181B] font-sans text-xs">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">
                    Concession Verification Desk
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#18181B]">
                    {selectedApp.name} ({selectedApp.applicationNo || selectedApp.id})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">College:</span>
                    <strong>{selectedApp.institution}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Roll No:</span>
                    <span className="font-mono">{selectedApp.enrolmentNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Course / Branch:</span>
                    <span>{selectedApp.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Authorized Corridor:</span>
                    <strong className="text-[#23533D]">{selectedApp.origin} ➔ {selectedApp.destination}</strong>
                  </div>
                </div>

                {selectedApp.collegeRemarks && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                    <strong>College Endorsement:</strong> {selectedApp.collegeRemarks}
                  </div>
                )}
              </div>

              {/* Modal Bottom Action Row */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <button
                  onClick={() => handleReject(selectedApp)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Reject Application
                </button>

                <div className="flex items-center gap-2">
                  {selectedApp.status === 'PAYMENT_COMPLETED' ? (
                    <button
                      onClick={() => handleIssuePass(selectedApp)}
                      className="px-5 py-2 rounded-xl bg-[#18181B] hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Issue Sovereign Pass
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleApproveCorridor(selectedApp);
                        setSelectedApp(null);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#23533D] hover:bg-[#1b4230] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Approve Corridor Route
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#18181B] text-white text-xs font-sans font-semibold shadow-2xl border border-zinc-700 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
