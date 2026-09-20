// ============================================================
// EduPass — Sovereign Transit Infrastructure Header
// Styled after Overprint reference design: dual-tile logo,
// Fraunces/Montserrat typography, warm studio beige palette.
// Features Interactive Stakeholder Auth Profile & Login Menu
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode,
  Moon,
  ChevronDown,
  LogOut,
  Shield,
  User,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function Header() {
  const location = useLocation();
  const { profile, user, signOut, quickLoginAs } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Track Status', to: '/track' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Apply', to: '/student/apply' },
    { label: 'Digital Pass', to: '/student/pass' },
    { label: 'College Portal', to: '/institution/dashboard' },
    { label: 'Depot Portal', to: '/admin/applications' },
    { label: 'Conductor', to: '/conductor' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5E0D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Overprint-style Dual Rectangles */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center relative">
            <div className="w-5 h-5 rounded-[4px] bg-[#18181B] group-hover:bg-[#23533D] transition-colors" />
            <div className="w-5 h-5 rounded-[4px] bg-[#23533D] -ml-2 -mt-1 opacity-90 group-hover:bg-[#18181B] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-[#18181B] tracking-tight leading-none">
              EduPass
            </span>
            <span className="text-[9px] font-sans font-semibold text-[#6E6D66] uppercase tracking-widest mt-1">
              Kerala Transit DPI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-sans tracking-tight transition-colors py-1 ${
                  isActive
                    ? 'text-[#18181B] font-bold border-b-2 border-[#18181B]'
                    : 'text-[#6E6D66] font-medium hover:text-[#18181B]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme toggle, Stakeholder Auth Profile Menu, Scanner CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Theme Toggle"
            className="p-2 rounded-full text-[#6E6D66] hover:text-[#18181B] hover:bg-[#EFE9DF] transition-colors hidden sm:flex items-center justify-center"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Interactive Stakeholder Profile / Login Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold bg-[#EFE9DF] text-[#18181B] hover:bg-[#E5E0D6] border border-[#E5E0D6] transition-all cursor-pointer shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#23533D] text-white flex items-center justify-center text-[10px] font-bold">
                {profile?.fullName ? profile.fullName.charAt(0) : <User className="w-3 h-3" />}
              </div>
              <span className="hidden sm:inline-block max-w-[100px] truncate">
                {profile?.fullName || 'Sign In'}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#23533D] border border-[#23533D]/20">
                {profile?.role || 'LOGIN'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E6D66]" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E0D6] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Card Header */}
                <div className="p-4 bg-[#18181B] text-white">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#23533D] text-white flex items-center justify-center text-xs font-bold">
                      {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {profile?.fullName || 'Stakeholder Session'}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[180px]">
                        {profile?.email || 'officer@ksrtc.gov.in'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Role: <strong className="text-emerald-400 uppercase">{profile?.role}</strong></span>
                  </div>
                </div>

                {/* Direct Portal Links */}
                <div className="p-2 border-b border-[#E5E0D6] text-xs font-sans">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#18181B] font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#23533D]" />
                      <span>Stakeholder Login Portal</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6E6D66]" />
                  </Link>

                  <Link
                    to="/review"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#FAF7F2] text-[#18181B] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>System Operations Hub</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6E6D66]">/review</span>
                  </Link>
                </div>

                {/* Quick Switch Persona Options */}
                <div className="p-2 border-b border-[#E5E0D6] bg-[#FAF7F2]/60">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase font-bold text-[#6E6D66]">
                    Quick Switch Role
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-1 pt-1">
                    <button
                      onClick={() => {
                        quickLoginAs('student');
                        setIsMenuOpen(false);
                      }}
                      className="px-2 py-1.5 text-left rounded-md text-[11px] font-sans font-medium text-[#18181B] hover:bg-white hover:shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🎓</span>
                      <span className="truncate">Student</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs('conductor');
                        setIsMenuOpen(false);
                      }}
                      className="px-2 py-1.5 text-left rounded-md text-[11px] font-sans font-medium text-[#18181B] hover:bg-white hover:shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🚌</span>
                      <span className="truncate">Conductor</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs('admin');
                        setIsMenuOpen(false);
                      }}
                      className="px-2 py-1.5 text-left rounded-md text-[11px] font-sans font-medium text-[#18181B] hover:bg-white hover:shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🛡️</span>
                      <span className="truncate">Depot Admin</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs('authority');
                        setIsMenuOpen(false);
                      }}
                      className="px-2 py-1.5 text-left rounded-md text-[11px] font-sans font-medium text-[#18181B] hover:bg-white hover:shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🏛️</span>
                      <span className="truncate">Authority</span>
                    </button>
                  </div>
                </div>

                {/* Sign In / Sign Out Footer */}
                <div className="p-2 flex items-center justify-between text-xs">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-sans font-semibold text-[#23533D] hover:underline px-2 py-1"
                  >
                    Switch Account
                  </Link>

                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#18181B] hover:bg-[#EFE9DF] rounded-lg transition-colors font-semibold"
                    >
                      <span>Log In</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Launch Scanner */}
          <Link
            to="/conductor/scan"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#18181B] text-white text-xs font-sans font-semibold hover:bg-[#2A2A2E] active:scale-[0.98] transition-all shadow-sm shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch Scanner</span>
            <span className="sm:hidden">Scan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
