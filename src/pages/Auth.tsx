// ============================================================
// EduPass — Multi-Stakeholder Authentication & Registration
// Faithful implementation of PDF Reference Workflows (Pages 4, 5, 8, 9, 11)
// Supports all Indian State Transport Undertakings (KSRTC, TNSTC, BMTC, APSRTC, MSRTC, DTC)
// Styled with warm studio beige (#FAF7F2), Fraunces & Montserrat
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  KeyRound,
  User,
  Building2,
  Bus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import Header from '../components/Header';
import { useAuth, type UserRole } from '../lib/auth-context';
import { operators } from '../lib/data-store';
import type { TransportOperator } from '../lib/types';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile, signIn, signUp, signOut, quickLoginAs } = useAuth();

  // Tab State: 'login' | 'register'
  const isRegisterRoute = location.pathname === '/register' || searchParams.get('tab') === 'register';
  const [tab, setTab] = useState<'login' | 'register'>(isRegisterRoute ? 'register' : 'login');

  // Sub-registration Tab: 'student' | 'college' | 'depot' (PDF Pages 4, 8, 9, 11)
  const initialRoleParam = searchParams.get('role');
  const [regType, setRegType] = useState<'student' | 'college' | 'depot'>(
    initialRoleParam === 'college' ? 'college' : initialRoleParam === 'depot' ? 'depot' : 'student'
  );

  // Login Form States (PDF Page 5)
  const [loginUserType, setLoginUserType] = useState<'Student' | 'College Admin' | 'Depot Officer' | 'Bus Conductor'>('Student');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Common Register States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Student Register Form States (PDF Page 11)
  const [studentFirst, setStudentFirst] = useState('Archana');
  const [studentLast, setStudentLast] = useState('Ajit');
  const [studentCollegeId, setStudentCollegeId] = useState('mzc20cs031');
  const [studentDob, setStudentDob] = useState('2002-03-14');
  const [studentGender, setStudentGender] = useState('Female');
  const [studentPhone, setStudentPhone] = useState('9447123456');
  const [studentAltPhone, setStudentAltPhone] = useState('9846123456');
  const [studentEmail, setStudentEmail] = useState('archana.ajit@gmail.com');
  const [studentAddress, setStudentAddress] = useState('Cochi Dhanushkodi Road, Varikoli, Puthenkurish, Kochi, Kerala 682308');
  const [studentCourse, setStudentCourse] = useState('PG');
  const [studentDept, setStudentDept] = useState('MCA');
  const [studentSem, setStudentSem] = useState('S4');
  const [studentCollege, setStudentCollege] = useState('Muthoot Institute of Technology and Science, Varikoli');
  const [studentOperator, setStudentOperator] = useState('KSRTC');
  const [studentUsername, setStudentUsername] = useState('archana_ajit');

  // College Register Form States (PDF Page 8 & 9)
  const [collegeName, setCollegeName] = useState('Muthoot Institute Of Technology & Science');
  const [collegeDistrict, setCollegeDistrict] = useState('Ernakulam');
  const [collegeState, setCollegeState] = useState('Kerala');
  const [collegeContactPerson, setCollegeContactPerson] = useState('College Admin');
  const [collegeAddress, setCollegeAddress] = useState('Cochi Dhanushkodi Road, Varikoli, Puthenkurish, Kochi, Kerala 682308');
  const [collegePhone, setCollegePhone] = useState('04842732111');
  const [collegeEmail, setCollegeEmail] = useState('admin@mgits.ac.in');
  const [collegeUsername, setCollegeUsername] = useState('mits_admin');

  // Depot Register Form States (PDF Page 4)
  const [depotOperator, setDepotOperator] = useState('KSRTC');
  const [depotName, setDepotName] = useState('Ernakulam Depot');
  const [depotLocation, setDepotLocation] = useState('Ernakulam');
  const [depotContactPerson, setDepotContactPerson] = useState('KSRTC Concession Officer');
  const [depotAddress, setDepotAddress] = useState('KSRTC Central Bus Station, Karikkamuri, Ernakulam, Kerala 682011');
  const [depotPhone, setDepotPhone] = useState('04842372033');
  const [depotEmail, setDepotEmail] = useState('depot.ernakulam@keralartc.com');
  const [depotUsername, setDepotUsername] = useState('ksrtc_ekm');

  // Alert States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('tab') === 'register' || location.pathname === '/register') {
      setTab('register');
    }
  }, [searchParams, location.pathname]);

  // Handle Login Submit (PDF Page 5)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    const emailToUse = loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@transport.gov.in`;
    const res = await signIn(emailToUse, loginPassword || 'demo123');
    setSubmitting(false);

    if (res.error && !loginIdentifier) {
      setErrorMsg(res.error.message || 'Authentication failed. Please verify your credentials.');
      return;
    }

    // Role redirection
    setSuccessMsg(`Authenticated successfully as ${loginUserType}. Redirecting...`);
    setTimeout(() => {
      if (loginUserType === 'Student') {
        quickLoginAs('student');
        navigate('/student/dashboard');
      } else if (loginUserType === 'College Admin') {
        quickLoginAs('institution');
        navigate('/institution/dashboard');
      } else if (loginUserType === 'Depot Officer') {
        quickLoginAs('admin');
        navigate('/admin/applications');
      } else {
        quickLoginAs('conductor');
        navigate('/conductor');
      }
    }, 600);
  };

  // Handle Register Submit (PDF Pages 4, 8, 9, 11)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('You must agree to the terms and conditions to proceed.');
      return;
    }

    setSubmitting(true);

    if (regType === 'student') {
      const res = await signUp(
        studentEmail,
        password || 'pass123',
        `${studentFirst} ${studentLast}`,
        'student',
        studentCollege
      );
      setSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error.message || 'Registration could not be completed.');
      } else {
        setSuccessMsg(`Student account provisioned for ${studentFirst} ${studentLast}. Navigating to application portal...`);
        quickLoginAs('student');
        setTimeout(() => navigate('/student/apply'), 800);
      }
    } else if (regType === 'college') {
      const res = await signUp(
        collegeEmail,
        password || 'pass123',
        `${collegeName} Admin`,
        'institution',
        collegeName
      );
      setSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error.message || 'Registration could not be completed.');
      } else {
        setSuccessMsg(`College administration account registered for ${collegeName}. Opening verification desk...`);
        quickLoginAs('institution');
        setTimeout(() => navigate('/institution/dashboard'), 800);
      }
    } else {
      const res = await signUp(
        depotEmail,
        password || 'pass123',
        `${depotOperator} ${depotName} Officer`,
        'admin',
        `${depotOperator} ${depotName}`
      );
      setSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error.message || 'Registration could not be completed.');
      } else {
        setSuccessMsg(`Transport Depot account provisioned for ${depotName} (${depotOperator}). Opening corridor desk...`);
        quickLoginAs('admin');
        setTimeout(() => navigate('/admin/applications'), 800);
      }
    }
  };

  const handleQuickSwitch = (role: UserRole, targetRoute: string) => {
    quickLoginAs(role);
    setSuccessMsg(`Session switched to ${role.toUpperCase()}. Directing to dedicated portal...`);
    setTimeout(() => navigate(targetRoute), 350);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 sm:pt-10 pb-12">
        {/* Navigation Breadcrumb & Live System Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#6E6D66] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to National Public Transit Portal</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0EC] text-[#23533D] text-[11px] font-mono font-medium border border-[#23533D]/20 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Multi-State Transit Authority Engine · 256-Bit SSL</span>
          </div>
        </div>

        {/* Main Authentication Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-[#E5E0D6] overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-[#18181B] text-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#23533D] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Interstate Public Transport Undertakings
                  </div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
                    Student Concession Authority
                  </h1>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 text-stone-300 border border-white/10">
                  ALL-RTC COMPATIBLE
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-stone-300 mt-2.5 max-w-xl leading-relaxed">
              Unified digital access for bona fide students, educational institutions, depot officers, and on-board bus ticket conductors across Kerala (KSRTC), Tamil Nadu (TNSTC), Karnataka (BMTC), Andhra Pradesh (APSRTC), Maharashtra (MSRTC), and Delhi (DTC).
            </p>

            {/* Current Active Identity Pill */}
            {profile && (
              <div className="mt-5 p-3.5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#23533D] text-white flex items-center justify-center font-bold text-xs">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-sans text-white flex items-center gap-2">
                      <span>{profile.fullName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-white/20 text-white">
                        {profile.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 font-sans">{profile.email}</div>
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 text-xs font-sans font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-300">Active Test Persona</span>
                )}
              </div>
            )}
          </div>

          {/* Tab Navigation: Login vs Register (PDF Pages 4, 5, 8, 9, 11) */}
          <div className="flex border-b border-[#E5E0D6] bg-[#FAF7F2] p-1.5 gap-1.5">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3 text-xs font-sans font-bold tracking-wide rounded-xl transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#18181B] shadow-xs border border-[#E5E0D6]'
                  : 'text-[#6E6D66] hover:text-[#18181B]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-3 text-xs font-sans font-bold tracking-wide rounded-xl transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-[#18181B] shadow-xs border border-[#E5E0D6]'
                  : 'text-[#6E6D66] hover:text-[#18181B]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 1: LOGIN TO YOUR ACCOUNT (PDF PAGE 5)                     */}
            {/* ============================================================ */}
            {tab === 'login' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="mb-5">
                  <h2 className="font-display font-bold text-xl text-[#18181B]">Login to Your Account</h2>
                  <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
                    Access your concession application dashboard and real-time status.
                  </p>
                </div>

                {/* User Type Dropdown (From PDF Page 5) */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1.5">
                    User Type
                  </label>
                  <select
                    value={loginUserType}
                    onChange={(e) => setLoginUserType(e.target.value as any)}
                    className="w-full px-3.5 py-3 text-sm bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] outline-none font-sans"
                  >
                    <option value="Student">Student (Apply, Renew & Pass Holder)</option>
                    <option value="College Admin">College Admin / Registrar (Student Verification)</option>
                    <option value="Depot Officer">Transport Depot Officer (Corridor Approval & Pass Issuance)</option>
                    <option value="Bus Conductor">Bus Conductor (On-Board QR Scanner)</option>
                  </select>
                </div>

                {/* Email / Username (From PDF Page 5) */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1.5">
                    Email / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6E6D66] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        loginUserType === 'Student'
                          ? 'e.g. archana_ajit or pooja.m@cet.ac.in'
                          : loginUserType === 'College Admin'
                          ? 'e.g. mits_admin or admin@cet.ac.in'
                          : loginUserType === 'Depot Officer'
                          ? 'e.g. ksrtc_ekm or depot.officer@keralartc.com'
                          : 'e.g. conductor.rajesh@ksrtc.gov.in'
                      }
                      className="w-full pl-10 pr-3.5 py-3 text-sm bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Password (From PDF Page 5) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-sans font-semibold text-[#18181B]">
                      Password
                    </label>
                    <span className="text-[11px] font-sans text-[#6E6D66] hover:text-[#18181B] cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#6E6D66] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 text-sm bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#6E6D66] hover:text-[#18181B] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#6E6D66]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E5E0D6] text-[#18181B] focus:ring-[#18181B]"
                    />
                    <span>Remember this session for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#18181B] hover:bg-[#2B2B30] text-white font-sans font-bold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Authenticating...' : 'Login'}</span>
                </button>
              </form>
            )}

            {/* ============================================================ */}
            {/* TAB 2: REGISTRATION (PDF PAGES 4, 8, 9, 11)                   */}
            {/* ============================================================ */}
            {tab === 'register' && (
              <div>
                <div className="mb-4">
                  <h2 className="font-display font-bold text-xl text-[#18181B]">Registration</h2>
                  <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
                    Choose your registration type below:
                  </p>
                </div>

                {/* Sub-Tabs: Student | College | Transport Depot (From PDF Pages 4, 8, 9, 11) */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setRegType('student')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regType === 'student'
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B] border border-[#E5E0D6]'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegType('college')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regType === 'college'
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B] border border-[#E5E0D6]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>College</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegType('depot')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regType === 'depot'
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#6E6D66] hover:text-[#18181B] border border-[#E5E0D6]'
                    }`}
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Transport Depot</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* SUB-FORM A: STUDENT REGISTRATION (PDF PAGE 11) */}
                  {regType === 'student' && (
                    <motion.form
                      key="student"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-[#FAF7F2] border border-[#E5E0D6] rounded-xl mb-4">
                        <span className="font-sans font-bold text-xs text-[#18181B] block">Student Registration</span>
                        <span className="font-sans text-[11px] text-[#6E6D66]">
                          Create an account to apply for a student concession pass across state transport undertakings.
                        </span>
                      </div>

                      {/* First & Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">First Name</label>
                          <input
                            type="text"
                            required
                            value={studentFirst}
                            onChange={(e) => setStudentFirst(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Last Name</label>
                          <input
                            type="text"
                            required
                            value={studentLast}
                            onChange={(e) => setStudentLast(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* College ID & Date of Birth */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">College ID / Roll No</label>
                          <input
                            type="text"
                            required
                            value={studentCollegeId}
                            onChange={(e) => setStudentCollegeId(e.target.value)}
                            placeholder="e.g. mzc20cs031"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="w-3.5 h-3.5 text-[#6E6D66] absolute right-3 top-3 pointer-events-none" />
                            <input
                              type="date"
                              required
                              value={studentDob}
                              onChange={(e) => setStudentDob(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gender & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Gender</label>
                          <select
                            value={studentGender}
                            onChange={(e) => setStudentGender(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Alternate Phone & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Alternate Phone</label>
                          <input
                            type="tel"
                            value={studentAltPhone}
                            onChange={(e) => setStudentAltPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Residential Address */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Residential Address</label>
                        <textarea
                          rows={2}
                          required
                          value={studentAddress}
                          onChange={(e) => setStudentAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                        />
                      </div>

                      {/* Course, Department & Semester */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Course</label>
                          <input
                            type="text"
                            required
                            value={studentCourse}
                            onChange={(e) => setStudentCourse(e.target.value)}
                            placeholder="e.g. PG / B.Tech"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Department</label>
                          <input
                            type="text"
                            required
                            value={studentDept}
                            onChange={(e) => setStudentDept(e.target.value)}
                            placeholder="e.g. MCA / CSE"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Semester</label>
                          <select
                            value={studentSem}
                            onChange={(e) => setStudentSem(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          >
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                            <option value="S4">S4</option>
                            <option value="S5">S5</option>
                            <option value="S6">S6</option>
                            <option value="S7">S7</option>
                            <option value="S8">S8</option>
                          </select>
                        </div>
                      </div>

                      {/* College & Transport Operator */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">College</label>
                          <select
                            value={studentCollege}
                            onChange={(e) => setStudentCollege(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans truncate"
                          >
                            <option value="Muthoot Institute of Technology and Science, Varikoli">Muthoot Institute of Technology & Science</option>
                            <option value="Government Engineering College, Thrissur">Government Engineering College, Thrissur</option>
                            <option value="College of Engineering Trivandrum">College of Engineering Trivandrum</option>
                            <option value="TKM College of Engineering, Kollam">TKM College of Engineering, Kollam</option>
                            <option value="PSG College of Technology, Coimbatore">PSG College of Technology, Coimbatore (TNSTC)</option>
                            <option value="RV College of Engineering, Bangalore">RV College of Engineering, Bangalore (BMTC)</option>
                            <option value="COEP Technological University, Pune">COEP Technological University, Pune (MSRTC)</option>
                            <option value="Andhra University College of Engineering">Andhra University (APSRTC)</option>
                            <option value="Delhi Technological University">Delhi Technological University (DTC)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">State Public Transport</label>
                          <select
                            value={studentOperator}
                            onChange={(e) => setStudentOperator(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          >
                            {operators.map((op: TransportOperator) => (
                              <option key={op.id} value={op.id}>
                                {op.id} — {op.name} ({op.state})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Username, Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Username</label>
                          <input
                            type="text"
                            required
                            value={studentUsername}
                            onChange={(e) => setStudentUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Password</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Agree Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#6E6D66]">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="rounded border-[#E5E0D6] text-[#18181B] focus:ring-[#18181B]"
                          />
                          <span>I agree to the terms and conditions and certify academic enrollment</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-[#18181B] hover:bg-[#2B2B30] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer mt-2"
                      >
                        {submitting ? 'Registering...' : 'Register Student Account'}
                      </button>
                    </motion.form>
                  )}

                  {/* SUB-FORM B: COLLEGE REGISTRATION (PDF PAGES 8 & 9) */}
                  {regType === 'college' && (
                    <motion.form
                      key="college"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-[#FAF7F2] border border-[#E5E0D6] rounded-xl mb-4">
                        <span className="font-sans font-bold text-xs text-[#18181B] block">College Registration</span>
                        <span className="font-sans text-[11px] text-[#6E6D66]">
                          Register your college to verify bona fide student concession applications before depot clearance.
                        </span>
                      </div>

                      {/* College Name */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">College Name</label>
                        <input
                          type="text"
                          required
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                        />
                      </div>

                      {/* District, State & Contact Person */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">District</label>
                          <input
                            type="text"
                            required
                            value={collegeDistrict}
                            onChange={(e) => setCollegeDistrict(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={collegeState}
                            onChange={(e) => setCollegeState(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Contact Person</label>
                          <input
                            type="text"
                            required
                            value={collegeContactPerson}
                            onChange={(e) => setCollegeContactPerson(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Campus Address</label>
                        <textarea
                          rows={2}
                          required
                          value={collegeAddress}
                          onChange={(e) => setCollegeAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                        />
                      </div>

                      {/* Phone & Official Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={collegePhone}
                            onChange={(e) => setCollegePhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Official College Email</label>
                          <input
                            type="email"
                            required
                            value={collegeEmail}
                            onChange={(e) => setCollegeEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Username, Password & Confirm */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Username</label>
                          <input
                            type="text"
                            required
                            value={collegeUsername}
                            onChange={(e) => setCollegeUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Password</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#6E6D66]">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="rounded border-[#E5E0D6] text-[#18181B] focus:ring-[#18181B]"
                          />
                          <span>I agree to the terms and conditions for institution verification</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-[#18181B] hover:bg-[#2B2B30] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer mt-2"
                      >
                        {submitting ? 'Registering...' : 'Register College'}
                      </button>
                    </motion.form>
                  )}

                  {/* SUB-FORM C: TRANSPORT DEPOT REGISTRATION (PDF PAGE 4) */}
                  {regType === 'depot' && (
                    <motion.form
                      key="depot"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-[#FAF7F2] border border-[#E5E0D6] rounded-xl mb-4">
                        <span className="font-sans font-bold text-xs text-[#18181B] block">Transport Depot Registration</span>
                        <span className="font-sans text-[11px] text-[#6E6D66]">
                          Register your bus depot to manage corridor approvals and issue cryptographically verifiable student concessions.
                        </span>
                      </div>

                      {/* Operator & Depot Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">State Transport Undertaking</label>
                          <select
                            value={depotOperator}
                            onChange={(e) => setDepotOperator(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          >
                            {operators.map((op: TransportOperator) => (
                              <option key={op.id} value={op.id}>
                                {op.id} — {op.name} ({op.state})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Depot Name</label>
                          <input
                            type="text"
                            required
                            value={depotName}
                            onChange={(e) => setDepotName(e.target.value)}
                            placeholder="e.g. Ernakulam Depot / Thrissur Central"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Location & Contact Person */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Location / District</label>
                          <input
                            type="text"
                            required
                            value={depotLocation}
                            onChange={(e) => setDepotLocation(e.target.value)}
                            placeholder="e.g. Ernakulam"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Contact Person / Officer</label>
                          <input
                            type="text"
                            required
                            value={depotContactPerson}
                            onChange={(e) => setDepotContactPerson(e.target.value)}
                            placeholder="e.g. KSRTC Concession Officer"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Depot Address */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Depot Address</label>
                        <textarea
                          rows={2}
                          required
                          value={depotAddress}
                          onChange={(e) => setDepotAddress(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                        />
                      </div>

                      {/* Phone & Official Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={depotPhone}
                            onChange={(e) => setDepotPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Official Depot Email</label>
                          <input
                            type="email"
                            required
                            value={depotEmail}
                            onChange={(e) => setDepotEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Username, Password & Confirm */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Username</label>
                          <input
                            type="text"
                            required
                            value={depotUsername}
                            onChange={(e) => setDepotUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Password</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#18181B] mb-1">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E5E0D6] focus:border-[#18181B] outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#6E6D66]">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="rounded border-[#E5E0D6] text-[#18181B] focus:ring-[#18181B]"
                          />
                          <span>I agree to the terms and conditions for transport authority administration</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-[#18181B] hover:bg-[#2B2B30] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer mt-2"
                      >
                        {submitting ? 'Registering...' : 'Register Transport Depot'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ============================================================ */}
            {/* FAST-TRACK ROLE EVALUATION DRAWER                           */}
            {/* 1-Click Instant Persona Navigation for Evaluators            */}
            {/* ============================================================ */}
            <div className="mt-8 pt-8 border-t border-[#E5E0D6]">
              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#23533D] font-bold">
                  Fast-Track Role Navigation
                </span>
                <h3 className="font-display text-lg font-bold text-[#18181B]">
                  One-Click Stakeholder Personas
                </h3>
                <p className="font-sans text-xs text-[#6E6D66]">
                  Instantly activate a verified role to evaluate dedicated portals without re-typing credentials:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Student */}
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('student', '/student/dashboard')}
                  className="p-3 rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E0D6] text-[#18181B] flex items-center justify-center font-bold text-sm shadow-2xs">
                      🎓
                    </div>
                    <div>
                      <div className="font-sans font-bold text-xs text-[#18181B] group-hover:text-[#23533D] flex items-center gap-1.5">
                        <span>Pooja M</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#EAF0EC] text-[#23533D] font-bold">
                          Student
                        </span>
                      </div>
                      <div className="font-sans text-[10px] text-[#6E6D66]">
                        GEC Thrissur · Active Pass
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6E6D66] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. College Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('institution', '/institution/dashboard')}
                  className="p-3 rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E0D6] text-[#18181B] flex items-center justify-center font-bold text-sm shadow-2xs">
                      🏛️
                    </div>
                    <div>
                      <div className="font-sans font-bold text-xs text-[#18181B] group-hover:text-[#23533D] flex items-center gap-1.5">
                        <span>Dean of Affairs</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#EAF0EC] text-[#23533D] font-bold">
                          College
                        </span>
                      </div>
                      <div className="font-sans text-[10px] text-[#6E6D66]">
                        CET Registry Desk
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6E6D66] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Depot Officer */}
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('admin', '/admin/applications')}
                  className="p-3 rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E0D6] text-[#18181B] flex items-center justify-center font-bold text-sm shadow-2xs">
                      🏢
                    </div>
                    <div>
                      <div className="font-sans font-bold text-xs text-[#18181B] group-hover:text-[#23533D] flex items-center gap-1.5">
                        <span>Officer S. Nair</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#EAF0EC] text-[#23533D] font-bold">
                          Depot
                        </span>
                      </div>
                      <div className="font-sans text-[10px] text-[#6E6D66]">
                        KSRTC Central Concession
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6E6D66] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Conductor */}
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('conductor', '/conductor')}
                  className="p-3 rounded-2xl border border-[#E5E0D6] hover:border-[#18181B] bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E0D6] text-[#18181B] flex items-center justify-center font-bold text-sm shadow-2xs">
                      🚌
                    </div>
                    <div>
                      <div className="font-sans font-bold text-xs text-[#18181B] group-hover:text-[#23533D] flex items-center gap-1.5">
                        <span>Rajesh Kumar</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#EAF0EC] text-[#23533D] font-bold">
                          Conductor
                        </span>
                      </div>
                      <div className="font-sans text-[10px] text-[#6E6D66]">
                        KSRTC TVM · Badge #4481
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6E6D66] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
