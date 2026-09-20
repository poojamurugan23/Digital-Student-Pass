// ============================================================
// EduPass — College Admin Dashboard
// Reference: Matches PDF Page 10 (Metric Cards, Tab Filters,
// Applications Table, Verification Handlers & Quick Actions Sidebar)
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  Check,
  Eye,
  X,
  PhoneCall,
  FileCheck,
  GraduationCap,
} from 'lucide-react';
import Header from '../../components/Header';
import { applications } from '../../lib/data-store';
import { useAuth } from '../../lib/auth-context';
import type { StudentApplication } from '../../lib/types';

export default function InstitutionDashboard() {
  const { profile } = useAuth();
  const [appList, setAppList] = useState<StudentApplication[]>([...applications]);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const collegeName = profile?.institution || 'Government Engineering College, Thrissur';

  // Metrics for Top 4 Cards (Matches PDF Page 10)
  const pendingCount = appList.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'PENDING'
  ).length;

  const verifiedCount = appList.filter(
    (a) =>
      a.status === 'COLLEGE_VERIFIED' ||
      a.status === 'DEPOT_APPROVED' ||
      a.status === 'PAYMENT_PENDING' ||
      a.status === 'PAYMENT_COMPLETED' ||
      a.status === 'APPROVED'
  ).length;

  const rejectedCount = appList.filter((a) => a.status === 'REJECTED').length;
  const totalCount = appList.length;

  // Filter apps by active tab
  const getTabApps = () => {
    switch (activeTab) {
      case 'pending':
        return appList.filter((a) => a.status === 'SUBMITTED' || a.status === 'PENDING');
      case 'verified':
        return appList.filter(
          (a) =>
            a.status === 'COLLEGE_VERIFIED' ||
            a.status === 'DEPOT_APPROVED' ||
            a.status === 'PAYMENT_PENDING' ||
            a.status === 'PAYMENT_COMPLETED' ||
            a.status === 'APPROVED'
        );
      case 'rejected':
        return appList.filter((a) => a.status === 'REJECTED');
      default:
        return appList;
    }
  };

  // Filter by search term
  const filteredApps = getTabApps().filter((a) => {
    return (
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.applicationNo && a.applicationNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.enrolmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Action: College Verifies Student Enrolment
  const handleVerify = (app: StudentApplication) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const idx = applications.findIndex((a) => a.id === app.id);
    if (idx !== -1) {
      applications[idx].status = 'COLLEGE_VERIFIED';
      applications[idx].collegeVerifiedAt = nowSec;
      applications[idx].collegeRemarks =
        'Bonafide student enrolment verified with Principal & Registrar seal.';
    }
    setAppList([...applications]);
    setSelectedApp(null);
    showToast(`Application for ${app.name} verified and forwarded to transport depot!`);
  };

  // Action: College Rejects Student
  const handleReject = (app: StudentApplication) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const idx = applications.findIndex((a) => a.id === app.id);
    if (idx !== -1) {
      applications[idx].status = 'REJECTED';
      applications[idx].rejectedAt = nowSec;
      applications[idx].rejectionReason =
        'Enrolment records do not match institutional semester roll.';
    }
    setAppList([...applications]);
    setSelectedApp(null);
    showToast(`Application for ${app.name} rejected.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
        {/* Top Breadcrumb */}
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
            <span>INSTITUTION DESK ACTIVE</span>
          </div>
        </div>

        {/* Welcome Header (Matches PDF Page 10) */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#23533D] font-bold">
              Institutional Registry & Verification Portal
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] mt-0.5">
            College Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] mt-1">
            Welcome, College Admin ({collegeName}). Verify bonafide student attendance, course enrolment, and forward concession applications to the state transport depot.
          </p>
        </div>

        {/* 4 Stat Cards (Matches PDF Page 10 Top Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Pending Applications */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Pending Applications
            </span>
            <div className="font-display text-3xl font-bold text-[#18181B] mt-1">
              {pendingCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Applications awaiting verification</div>
          </button>

          {/* Card 2: Verified Applications */}
          <button
            onClick={() => setActiveTab('verified')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Verified Applications
            </span>
            <div className="font-display text-3xl font-bold text-[#23533D] mt-1">
              {verifiedCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Applications verified by college</div>
          </button>

          {/* Card 3: Rejected Applications */}
          <button
            onClick={() => setActiveTab('rejected')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-white border-[#18181B] shadow-md ring-2 ring-[#18181B]/10'
                : 'bg-white border-[#E5E0D6] hover:border-stone-400 shadow-xs'
            }`}
          >
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Rejected Applications
            </span>
            <div className="font-display text-3xl font-bold text-rose-700 mt-1">
              {rejectedCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Applications rejected by college</div>
          </button>

          {/* Card 4: Total Applications */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Total Applications
            </span>
            <div className="font-display text-3xl font-bold text-[#18181B] mt-1">
              {totalCount}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Total applications received</div>
          </div>
        </div>

        {/* Main Workspace: Table on Left + Quick Actions Sidebar on Right (Matches PDF Page 10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications Table (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-[#EFE9DF] rounded-xl border border-[#E5E0D6] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                College Verification ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'verified'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Verified Applications ({verifiedCount})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'rejected'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#6E6D66] hover:text-[#18181B]'
                }`}
              >
                Rejected Applications ({rejectedCount})
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applications by student name, roll number, or ID..."
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-[#18181B] placeholder:text-stone-400 focus:outline-hidden focus:border-[#18181B]"
                />
              </div>
            </div>

            {/* Applications Table (Matches PDF Page 10) */}
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
                          <td className="py-3.5 px-4 font-mono font-bold text-[#18181B]">
                            {app.applicationNo || app.id}
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="text-[#18181B] block">{app.name}</strong>
                            <span className="text-[11px] text-stone-500 block truncate max-w-[220px]">
                              {app.course} · {app.enrolmentNo}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#18181B] block">
                              {app.origin} ➔ {app.destination}
                            </span>
                            <span className="text-[10px] text-stone-500">{app.transportOperator}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                app.status === 'APPROVED' || app.status === 'COLLEGE_VERIFIED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : app.status === 'REJECTED'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                            {new Date(app.submittedAt * 1000).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending Verification */}
                              {(app.status === 'SUBMITTED' || app.status === 'PENDING') && (
                                <button
                                  onClick={() => handleVerify(app)}
                                  className="px-3 py-1.5 rounded-lg bg-[#23533D] hover:bg-[#1b4230] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Verify & Forward</span>
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedApp(app)}
                                title="Review Details"
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
              <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#E5E0D6] flex items-center justify-between text-[11px] text-stone-500">
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

          {/* Right Column: Quick Actions Sidebar (Matches PDF Page 10) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs space-y-3">
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
                <span>Pending Verifications</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {pendingCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('verified')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'verified'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Verified Applications</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {verifiedCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                  activeTab === 'rejected'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Rejected Applications</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                  {rejectedCount}
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

            {/* College Registry Info */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E5E0D6] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#23533D]" />
                <strong className="text-[#18181B]">Bona Fide Certification</strong>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Verification by this desk legally endorses that the applicant is an enrolled full-time student for the active academic term.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Review & Endorse Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 relative text-[#18181B] text-xs">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">
                    Institutional Enrolment Review
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#18181B]">
                    {selectedApp.name} ({selectedApp.enrolmentNo})
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
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Institution:</span>
                    <strong>{selectedApp.institution}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Course & Year:</span>
                    <span>{selectedApp.course} · {selectedApp.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mobile / Email:</span>
                    <span>{selectedApp.mobile} · {selectedApp.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Requested Corridor:</span>
                    <strong className="text-[#23533D]">{selectedApp.origin} ➔ {selectedApp.destination}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <button
                  onClick={() => handleReject(selectedApp)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Reject Enrolment
                </button>

                <button
                  onClick={() => handleVerify(selectedApp)}
                  className="px-5 py-2 rounded-xl bg-[#23533D] hover:bg-[#1b4230] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Endorse & Forward to Depot</span>
                </button>
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
