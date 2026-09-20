// ============================================================
// EduPass — Student Application Form
// ============================================================
// Multi-step form with 5 steps: Personal → Institution →
// Travel → Proof Upload → Review & Submit
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, User, Building2, Bus, Upload,
  CheckCircle, FileText, Camera
} from 'lucide-react';
import { applications } from '../../lib/data-store';
import { uploadToSupabaseStorage, syncApplicationToSupabase } from '../../lib/supabase';
import type { StudentApplication } from '../../lib/types';

const steps = ['Personal', 'Institution', 'Travel', 'Documents', 'Review'];

interface FormData {
  name: string;
  email: string;
  mobile: string;
  institution: string;
  enrolmentNo: string;
  course: string;
  department: string;
  year: string;
  origin: string;
  destination: string;
  routeClass: string;
  transportOperator: string;
  photoFile: File | null;
  proofFile: File | null;
  studentIdFile: File | null;
}

export default function StudentApply() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '', email: '', mobile: '',
    institution: '', enrolmentNo: '', course: '', department: '', year: '',
    origin: '', destination: '', routeClass: 'STUDENT', transportOperator: 'KSRTC',
    photoFile: null, proofFile: null, studentIdFile: null,
  });

  const update = (field: keyof FormData, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatusMessage('Uploading documents to Supabase Storage...');

    let photoUrl = '';
    let proofUrl = '';
    let studentIdUrl = '';

    if (form.photoFile) {
      photoUrl = await uploadToSupabaseStorage(form.photoFile, 'photos');
    }
    if (form.proofFile) {
      proofUrl = await uploadToSupabaseStorage(form.proofFile, 'proofs');
    }
    if (form.studentIdFile) {
      studentIdUrl = await uploadToSupabaseStorage(form.studentIdFile, 'student-ids');
    }

    setStatusMessage('Saving application to Supabase database...');
    const id = `APP-${String(applications.length + 1).padStart(3, '0')}`;
    const applicationNo = `${form.transportOperator}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp: StudentApplication = {
      id,
      applicationNo,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      photoUrl,
      institution: form.institution,
      enrolmentNo: form.enrolmentNo,
      course: form.course,
      department: form.department,
      year: form.year,
      origin: form.origin,
      destination: form.destination,
      routeClass: form.routeClass,
      transportOperator: form.transportOperator,
      proofUrl,
      studentIdUrl,
      status: 'SUBMITTED',
      submittedAt: Math.floor(Date.now() / 1000),
    };

    applications.push(newApp);
    await syncApplicationToSupabase(newApp);

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    const latestApp = applications[applications.length - 1];
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-[#E5E0D6] p-8 max-w-md w-full text-center shadow-lg font-sans"
        >
          <div className="w-14 h-14 rounded-full bg-[#EAF0EC] text-[#23533D] flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#23533D]" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#23533D] font-bold block mb-1">
            Application Registered
          </span>
          <h2 className="font-display text-2xl font-bold text-[#18181B] mb-1">
            {latestApp?.applicationNo || latestApp?.id}
          </h2>
          <p className="text-xs text-[#6E6D66] mb-6 leading-relaxed">
            Your bona fide student concession application has been successfully submitted and forwarded
            to <strong>{latestApp?.institution}</strong> for enrollment verification.
          </p>
          <div className="space-y-2.5">
            <Link
              to={`/track?id=${latestApp?.applicationNo || latestApp?.id}`}
              className="block w-full py-3 bg-[#18181B] text-white font-sans font-bold text-xs rounded-xl hover:bg-[#2B2B30] transition-colors shadow-xs"
            >
              Track Application Progress →
            </Link>
            <Link
              to="/student/dashboard"
              className="block w-full py-3 border border-[#E5E0D6] text-[#18181B] font-sans font-semibold text-xs rounded-xl hover:bg-[#FAF7F2] transition-colors"
            >
              Return to Student Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 bg-white border border-[#E5E0D6] rounded-xl font-sans text-xs text-[#18181B] placeholder:text-[#6E6D66]/50 focus:outline-none focus:border-[#18181B] transition-colors';
  const labelClass =
    'block font-sans text-[11px] font-bold text-[#18181B] mb-1.5 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E5E0D6]">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center gap-3">
          <Link
            to="/review"
            className="p-2 -ml-2 hover:bg-[#F0ECE3] rounded-lg transition-colors text-[#18181B]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-base text-[#18181B] leading-tight">
              Student Concession Application
            </h1>
            <p className="font-sans text-[10px] text-[#6E6D66]">
              Step {step + 1} of {steps.length} · {steps[step]}
            </p>
          </div>
        </div>
        {/* Progress */}
        <div className="max-w-lg mx-auto px-4 pb-2.5">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-[#18181B]' : 'bg-[#E5E0D6]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 w-full flex-1">
        <AnimatePresence mode="wait">
          {/* STEP 0: Personal */}
          {step === 0 && (
            <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-ep-green" />
                <h2 className="font-sans font-bold text-lg text-ep-dark">Personal Information</h2>
              </div>
              <div>
                <label className={labelClass}>Full Name *</label>
                <input type="text" className={inputClass} placeholder="Enter your full name" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" className={inputClass} placeholder="your.email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
              </div>
            </motion.div>
          )}

          {/* STEP 1: Institution */}
          {step === 1 && (
            <motion.div key="institution" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-ep-green" />
                <h2 className="font-sans font-bold text-lg text-ep-dark">Institution Details</h2>
              </div>
              <div>
                <label className={labelClass}>Institution *</label>
                <input type="text" className={inputClass} placeholder="e.g. Government Engineering College, Thrissur" value={form.institution} onChange={e => update('institution', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Enrolment / Student Number *</label>
                <input type="text" className={inputClass} placeholder="e.g. GEC2024CS042" value={form.enrolmentNo} onChange={e => update('enrolmentNo', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Course</label>
                <input type="text" className={inputClass} placeholder="e.g. B.Tech Computer Science" value={form.course} onChange={e => update('course', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Department</label>
                  <input type="text" className={inputClass} placeholder="e.g. CSE" value={form.department} onChange={e => update('department', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <select className={inputClass} value={form.year} onChange={e => update('year', e.target.value)}>
                    <option value="">Select</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Travel */}
          {step === 2 && (
            <motion.div key="travel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Bus className="w-5 h-5 text-ep-green" />
                <h2 className="font-sans font-bold text-lg text-ep-dark">Travel Information</h2>
              </div>
              <div>
                <label className={labelClass}>Origin *</label>
                <input type="text" className={inputClass} placeholder="Starting point" value={form.origin} onChange={e => update('origin', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Destination *</label>
                <input type="text" className={inputClass} placeholder="Destination" value={form.destination} onChange={e => update('destination', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Concession Class</label>
                <select className={inputClass} value={form.routeClass} onChange={e => update('routeClass', e.target.value)}>
                  <option value="STUDENT">Student</option>
                  <option value="STUDENT_MONTHLY">Student Monthly</option>
                  <option value="STUDENT_QUARTERLY">Student Quarterly</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Transport Operator</label>
                <select className={inputClass} value={form.transportOperator} onChange={e => update('transportOperator', e.target.value)}>
                  <option value="KSRTC">Kerala State Road Transport Corporation</option>
                  <option value="TNSTC">Tamil Nadu State Transport Corporation</option>
                  <option value="BMTC">Bangalore Metropolitan Transport Corporation</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-ep-green" />
                <h2 className="font-sans font-bold text-lg text-ep-dark">Upload Documents</h2>
              </div>

              {[
                { key: 'photoFile' as const, label: 'Photo', icon: Camera, accept: 'image/*' },
                { key: 'proofFile' as const, label: 'Proof of Enrolment', icon: FileText, accept: 'image/*,.pdf' },
                { key: 'studentIdFile' as const, label: 'Student ID Card', icon: FileText, accept: 'image/*,.pdf' },
              ].map(({ key, label, icon: Icon, accept }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <label className="flex items-center gap-3 p-4 bg-white border-2 border-dashed border-ep-border rounded-[var(--radius-ep)] cursor-pointer hover:border-ep-green/40 transition-colors">
                    <Icon className="w-5 h-5 text-ep-muted" />
                    <div className="flex-1">
                      {form[key] ? (
                        <p className="font-sans text-sm font-semibold text-ep-green">{form[key]!.name}</p>
                      ) : (
                        <p className="font-sans text-sm text-ep-muted">Click to upload</p>
                      )}
                    </div>
                    <input type="file" accept={accept} className="hidden" onChange={e => update(key, e.target.files?.[0] || null)} />
                  </label>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-ep-green" />
                <h2 className="font-sans font-bold text-lg text-ep-dark">Review Application</h2>
              </div>

              <div className="bg-white rounded-[var(--radius-ep)] border border-ep-border p-4 space-y-3">
                {[
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Mobile', form.mobile],
                  ['Institution', form.institution],
                  ['Enrolment No', form.enrolmentNo],
                  ['Course', form.course],
                  ['Year', form.year],
                  ['Origin → Destination', `${form.origin} → ${form.destination}`],
                  ['Class', form.routeClass],
                  ['Operator', form.transportOperator],
                  ['Photo', form.photoFile?.name || 'Not uploaded'],
                  ['Proof', form.proofFile?.name || 'Not uploaded'],
                  ['Student ID', form.studentIdFile?.name || 'Not uploaded'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-1 border-b border-ep-border last:border-0">
                    <span className="text-xs font-sans font-semibold text-ep-muted">{label}</span>
                    <span className="text-xs font-sans font-semibold text-ep-dark text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3 border border-[#E5E0D6] bg-white text-[#18181B] font-sans font-semibold text-xs rounded-xl hover:bg-[#FAF7F2] transition-colors"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#18181B] text-white font-sans font-bold text-xs rounded-xl hover:bg-[#2B2B30] transition-colors active:scale-[0.98]"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#18181B] text-white font-sans font-bold text-xs rounded-xl hover:bg-[#2B2B30] transition-colors active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{statusMessage}</span>
                </>
              ) : (
                'Transmit Application to Depot'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
