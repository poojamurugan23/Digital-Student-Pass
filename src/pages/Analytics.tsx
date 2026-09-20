// ============================================================
// EduPass — Public Transport Concession Analytics Dashboard
// Reference: Matches PDF Page 3 (Application metrics, college stats,
// depot stats, processing times, and payment analytics)
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState } from 'react';
import {
  TrendingUp,
  Clock,
  CreditCard,
  Building2,
  Bus,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
} from 'lucide-react';
import Header from '../components/Header';

export default function AnalyticsDashboard() {
  const [chartMode, setChartMode] = useState<'bar' | 'donut'>('donut');
  const [selectedState, setSelectedState] = useState('ALL');

  // College breakdowns
  const collegeStats = [
    { name: 'Govt. Engineering College, Thrissur', state: 'Kerala', apps: 482, verified: 460, rate: '95.4%' },
    { name: 'TKM College of Engineering, Kollam', state: 'Kerala', apps: 320, verified: 298, rate: '93.1%' },
    { name: 'College of Engineering, Trivandrum (CET)', state: 'Kerala', apps: 512, verified: 492, rate: '96.1%' },
    { name: 'Muthoot Inst. of Technology & Science', state: 'Kerala', apps: 240, verified: 228, rate: '95.0%' },
    { name: 'PSG College of Technology, Coimbatore', state: 'Tamil Nadu', apps: 390, verified: 372, rate: '95.4%' },
    { name: 'RV College of Engineering, Bangalore', state: 'Karnataka', apps: 310, verified: 295, rate: '95.2%' },
    { name: 'COEP Technological University, Pune', state: 'Maharashtra', apps: 280, verified: 265, rate: '94.6%' },
  ];

  // Depot breakdowns
  const depotStats = [
    { name: 'Thrissur Central Depot', operator: 'KSRTC', apps: 520, issued: 498, avgTime: '1.4 days' },
    { name: 'Ernakulam South Depot', operator: 'KSRTC', apps: 440, issued: 412, avgTime: '1.6 days' },
    { name: 'Trivandrum Central Depot', operator: 'KSRTC', apps: 560, issued: 535, avgTime: '1.3 days' },
    { name: 'Kollam Bus Depot', operator: 'KSRTC', apps: 310, issued: 290, avgTime: '1.7 days' },
    { name: 'Coimbatore Central Depot', operator: 'TNSTC', apps: 415, issued: 390, avgTime: '1.5 days' },
    { name: 'Majestic Central Depot', operator: 'BMTC', apps: 340, issued: 315, avgTime: '1.8 days' },
  ];

  const filteredColleges =
    selectedState === 'ALL'
      ? collegeStats
      : collegeStats.filter((c) => c.state.toUpperCase().includes(selectedState));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-12 w-full">
        {/* Page Header (Matches PDF Page 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E6D66] font-bold block">
              Directorate of Public Transport · DPI Systems
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight mt-0.5">
              Analytics Dashboard
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6E6D66] mt-1">
              Comprehensive overview of student concession application processing, approval rates, and financial metrics.
            </p>
          </div>

          {/* State Filter Pill */}
          <div className="flex items-center gap-2 font-sans text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6E6D66]" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#E5E0D6] rounded-xl text-xs font-semibold text-[#18181B] focus:outline-hidden"
            >
              <option value="ALL">All States (Multi-RTC)</option>
              <option value="KERALA">Kerala (KSRTC)</option>
              <option value="TAMIL">Tamil Nadu (TNSTC)</option>
              <option value="KARNATAKA">Karnataka (BMTC)</option>
              <option value="MAHARASHTRA">Maharashtra (MSRTC)</option>
            </select>
          </div>
        </div>

        {/* 4 Metric Summary Cards (Matches PDF Page 3 Top Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-sans">
          {/* Card 1: Total Applications */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
            <span className="text-[10px] text-[#6E6D66] uppercase tracking-wider font-semibold block">
              Total Applications
            </span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] mt-1">
              2,494
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% from last semester</span>
            </div>
          </div>

          {/* Card 2: Average Processing Time */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
            <span className="text-[10px] text-[#6E6D66] uppercase tracking-wider font-semibold block">
              Average Processing Time
            </span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] mt-1">
              1.5 <span className="text-base font-normal text-stone-500 font-sans">days</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
              <Clock className="w-3 h-3" />
              <span>Down from 14 days (paper manual)</span>
            </div>
          </div>

          {/* Card 3: Total Concession Revenue */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
            <span className="text-[10px] text-[#6E6D66] uppercase tracking-wider font-semibold block">
              Total Concession Fees
            </span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#23533D] mt-1">
              ₹2,99,280
            </div>
            <div className="text-[10px] text-[#6E6D66] mt-1">
              Govt Subsidy: ₹1.42 Cr disbursed
            </div>
          </div>

          {/* Card 4: Average Payment */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-xs">
            <span className="text-[10px] text-[#6E6D66] uppercase tracking-wider font-semibold block">
              Average Payment
            </span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] mt-1">
              ₹120.00
            </div>
            <div className="text-[10px] text-[#6E6D66] mt-1">
              Nominal administrative fee
            </div>
          </div>
        </div>

        {/* Application Status Distribution (Matches PDF Page 3 Middle) */}
        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs mb-8 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-[#18181B]">
                Application Status Distribution
              </h3>
              <p className="text-xs text-[#6E6D66]">
                Overview of applications by current verification status
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center p-1 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-xs font-semibold">
              <button
                onClick={() => setChartMode('donut')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === 'donut' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#6E6D66]'
                }`}
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span>Pie / Donut</span>
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartMode === 'bar' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#6E6D66]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar Chart</span>
              </button>
            </div>
          </div>

          {/* Distribution Chart / Bars */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Submitted', count: 184, percent: 7, color: 'bg-blue-500' },
              { label: 'College Verified', count: 540, percent: 22, color: 'bg-indigo-500' },
              { label: 'Depot Approved', count: 480, percent: 19, color: 'bg-amber-500' },
              { label: 'Payment Pending', count: 120, percent: 5, color: 'bg-orange-500' },
              { label: 'Pass Issued', count: 1170, percent: 47, color: 'bg-emerald-600' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6]">
                <div className="flex items-center justify-between text-[11px] text-[#6E6D66] font-semibold mb-1">
                  <span>{item.label}</span>
                  <span className="font-mono">{item.percent}%</span>
                </div>
                <div className="font-display font-bold text-lg text-[#18181B]">{item.count}</div>
                <div className="w-full h-2 bg-stone-200 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent * 2}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stacked Visual Bar */}
          <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
            <div style={{ width: '7%' }} className="bg-blue-500" title="Submitted: 7%" />
            <div style={{ width: '22%' }} className="bg-indigo-500" title="College Verified: 22%" />
            <div style={{ width: '19%' }} className="bg-amber-500" title="Depot Approved: 19%" />
            <div style={{ width: '5%' }} className="bg-orange-500" title="Payment Pending: 5%" />
            <div style={{ width: '47%' }} className="bg-emerald-600" title="Pass Issued: 47%" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] font-sans text-[#6E6D66]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Submitted (7%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> College Verified (22%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Depot Approved (19%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Payment Pending (5%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Pass Issued (47%)</span>
          </div>
        </div>

        {/* Two-Column Stats: College Statistics vs Depot Statistics (Matches PDF Page 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 font-sans">
          {/* College Statistics */}
          <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#23533D]" />
                <h3 className="font-display font-bold text-base text-[#18181B]">
                  College Statistics
                </h3>
              </div>
              <span className="text-[10px] text-[#6E6D66] font-mono">By Educational Institution</span>
            </div>

            <div className="space-y-2.5 divide-y divide-stone-100">
              {filteredColleges.map((col, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <strong className="text-[#18181B] block truncate">{col.name}</strong>
                    <span className="text-[10px] text-stone-500">{col.state}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#18181B]">{col.apps} apps</span>
                    <div className="text-[10px] text-emerald-700 font-semibold">{col.rate} verified</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Depot Statistics */}
          <div className="bg-white rounded-2xl border border-[#E5E0D6] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#23533D]" />
                <h3 className="font-display font-bold text-base text-[#18181B]">
                  Depot Statistics
                </h3>
              </div>
              <span className="text-[10px] text-[#6E6D66] font-mono">By Transport Corporation</span>
            </div>

            <div className="space-y-2.5 divide-y divide-stone-100">
              {depotStats.map((dep, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <strong className="text-[#18181B] block truncate">{dep.name}</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                      {dep.operator}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#23533D]">{dep.issued} issued</span>
                    <div className="text-[10px] text-stone-500">Avg {dep.avgTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Analytics Section (Matches PDF Page 3 Bottom) */}
        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs font-sans">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-[#23533D]" />
            <h3 className="font-display font-bold text-base text-[#18181B]">
              Payment & Revenue Analytics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total Transactions</span>
              <span className="font-display font-bold text-2xl text-[#18181B]">2,494</span>
            </div>

            <div className="p-4 bg-[#EAF0EC] rounded-xl border border-[#23533D]/20 text-center">
              <span className="text-[10px] text-[#23533D] uppercase font-bold block">Total Concession Fees</span>
              <span className="font-display font-bold text-2xl text-[#23533D]">₹2,99,280</span>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">Digital Gateway Rate</span>
              <span className="font-display font-bold text-2xl text-[#18181B]">98.6%</span>
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <strong className="text-[#18181B] block">Primary Payment Channels:</strong>
              <span className="text-stone-500 text-[11px]">Instant clearance with zero manual reconciliation delays</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> UPI (GPay/PhonePe): 82%
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Debit / Credit: 12%
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400" /> NetBanking: 6%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
