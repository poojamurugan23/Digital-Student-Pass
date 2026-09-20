// ============================================================
// EduPass — In-Memory Data Store + Demo Seed
// ============================================================
// Replaces external database for hackathon prototype.
// All demo data is pre-seeded. New records persist in memory
// during the session. No external database required.
// ============================================================

import type {
  StudentApplication,
  Pass,
  Revocation,
  RosterEntry,
  ScanLog,
  SuspiciousActivity,
  TransportOperator,
} from './types';

// ── Pre-computed Demo Data ──────────────────────────────────
// These values are generated from a real Ed25519 keypair.
// The private key is stored server-side only.
// ────────────────────────────────────────────────────────────

// Ed25519 keypair (generated fresh — private key for server, public for client)
export const DEMO_PRIVATE_KEY = 'a52f159e1c25a7fb1b44eb0c66a5e0c9fdba77a8e9371a5a8d98fb45d6de0c37';
export const DEMO_PUBLIC_KEY = ''; // Will be derived at runtime

// This will be populated on first call
let _publicKey: string | null = null;

export async function getDemoPublicKey(): Promise<string> {
  if (_publicKey) return _publicKey;
  // Import dynamically to avoid circular deps
  const { getPublicKey } = await import('./crypto');
  _publicKey = await getPublicKey(DEMO_PRIVATE_KEY);
  return _publicKey;
}

// ── Transport Operators ─────────────────────────────────────

export const operators: TransportOperator[] = [
  {
    id: 'KSRTC',
    name: 'Kerala State Road Transport Corporation',
    state: 'Kerala',
    routes: ['Thrissur-Kunnamkulam', 'Trivandrum-Ernakulam', 'Ernakulam-Calicut', 'Calicut-Kannur', 'Varikoli-Vytilla'],
    concessionClasses: ['STUDENT_ORDINARY', 'STUDENT_FAST_PASSENGER'],
    validityPeriodDays: 90,
  },
  {
    id: 'TNSTC',
    name: 'Tamil Nadu State Transport Corporation',
    state: 'Tamil Nadu',
    routes: ['Coimbatore-Tiruppur', 'Chennai-Coimbatore', 'Chennai-Madurai', 'Madurai-Dindigul'],
    concessionClasses: ['STUDENT_FREE_PASS', 'STUDENT_SUBSIDIZED'],
    validityPeriodDays: 180,
  },
  {
    id: 'BMTC',
    name: 'Bangalore Metropolitan Transport Corporation',
    state: 'Karnataka',
    routes: ['Majestic-Kengeri', 'Majestic-Electronic City', 'Whitefield-Majestic', 'Yelahanka-Banashankari'],
    concessionClasses: ['STUDENT_MONTHLY', 'STUDENT_SEMESTER'],
    validityPeriodDays: 150,
  },
  {
    id: 'APSRTC',
    name: 'Andhra Pradesh State Road Transport Corporation',
    state: 'Andhra Pradesh',
    routes: ['Visakhapatnam-Gajuwaka', 'Vijayawada-Guntur', 'Tirupati-Chittoor'],
    concessionClasses: ['STUDENT_GENERAL', 'STUDENT_EXPRESS'],
    validityPeriodDays: 120,
  },
  {
    id: 'MSRTC',
    name: 'Maharashtra State Road Transport Corporation',
    state: 'Maharashtra',
    routes: ['Swargate-Hadapsar', 'Mumbai Central-Thane', 'Pune-Pimpri', 'Nagpur-Wardha'],
    concessionClasses: ['STUDENT_ORDINARY', 'STUDENT_MANAV_VIKAS'],
    validityPeriodDays: 180,
  },
  {
    id: 'DTC',
    name: 'Delhi Transport Corporation',
    state: 'Delhi',
    routes: ['Kashmiri Gate-Dhaula Kuan', 'Anand Vihar-Uttam Nagar', 'CP-Rohini'],
    concessionClasses: ['STUDENT_ALL_ROUTE', 'STUDENT_NON_AC'],
    validityPeriodDays: 90,
  },
];

export interface Depot {
  id: string;
  name: string;
  operatorId: string;
  state: string;
  location: string;
}

export const depots: Depot[] = [
  // Kerala Depots
  { id: 'DEP-KL-01', name: 'Thrissur Central Depot', operatorId: 'KSRTC', state: 'Kerala', location: 'Thrissur' },
  { id: 'DEP-KL-02', name: 'Ernakulam South Depot', operatorId: 'KSRTC', state: 'Kerala', location: 'Ernakulam' },
  { id: 'DEP-KL-03', name: 'Trivandrum Central Depot', operatorId: 'KSRTC', state: 'Kerala', location: 'Thiruvananthapuram' },
  { id: 'DEP-KL-04', name: 'Kollam Bus Depot', operatorId: 'KSRTC', state: 'Kerala', location: 'Kollam' },
  { id: 'DEP-KL-05', name: 'Kozhikode Depot', operatorId: 'KSRTC', state: 'Kerala', location: 'Kozhikode' },
  // Tamil Nadu Depots
  { id: 'DEP-TN-01', name: 'Coimbatore Central Depot', operatorId: 'TNSTC', state: 'Tamil Nadu', location: 'Coimbatore' },
  { id: 'DEP-TN-02', name: 'Chennai Central MTC Depot', operatorId: 'TNSTC', state: 'Tamil Nadu', location: 'Chennai' },
  { id: 'DEP-TN-03', name: 'Madurai Depot', operatorId: 'TNSTC', state: 'Tamil Nadu', location: 'Madurai' },
  // Karnataka Depots
  { id: 'DEP-KA-01', name: 'Majestic Central Depot', operatorId: 'BMTC', state: 'Karnataka', location: 'Bangalore' },
  { id: 'DEP-KA-02', name: 'Whitefield TTMC Depot', operatorId: 'BMTC', state: 'Karnataka', location: 'Bangalore' },
  // Andhra Pradesh Depots
  { id: 'DEP-AP-01', name: 'Visakhapatnam Depot', operatorId: 'APSRTC', state: 'Andhra Pradesh', location: 'Visakhapatnam' },
  { id: 'DEP-AP-02', name: 'Vijayawada PNBS Depot', operatorId: 'APSRTC', state: 'Andhra Pradesh', location: 'Vijayawada' },
  // Maharashtra Depots
  { id: 'DEP-MH-01', name: 'Swargate Pune Depot', operatorId: 'MSRTC', state: 'Maharashtra', location: 'Pune' },
  { id: 'DEP-MH-02', name: 'Mumbai Central Depot', operatorId: 'MSRTC', state: 'Maharashtra', location: 'Mumbai' },
];

// ── In-Memory Collections ───────────────────────────────────

export const applications: StudentApplication[] = [];
export const passes: Pass[] = [];
export const revocations: Revocation[] = [];
export const scanLogs: ScanLog[] = [];
export const suspiciousActivities: SuspiciousActivity[] = [];

// ── Demo Seed Function ──────────────────────────────────────
// Called once at startup to populate demo records

let _seeded = false;

export async function seedDemoData(): Promise<void> {
  if (_seeded) return;

  const { signCredential, generateSeed, serializeCredential, hashPhoto } = await import('./crypto');

  const nowSec = Math.floor(Date.now() / 1000);
  const ninetyDaysFromNow = nowSec + 90 * 24 * 60 * 60;
  const thirtyDaysAgo = nowSec - 30 * 24 * 60 * 60;

  // Demo photo hash (simulated from a stock photo)
  const demoPhotoHash = hashPhoto(new TextEncoder().encode('demo-student-photo-pooja'));
  const _demoPhotoHash2 = hashPhoto(new TextEncoder().encode('demo-student-photo-arjun'));
  const demoPhotoHash3 = hashPhoto(new TextEncoder().encode('demo-student-photo-meera'));
  const demoPhotoHash4 = hashPhoto(new TextEncoder().encode('demo-student-photo-ravi'));
  const demoPhotoHash5 = hashPhoto(new TextEncoder().encode('demo-student-photo-ananya'));
  void _demoPhotoHash2; // reserved for future use

  // ── PASS 1: Live Valid Pass ────────────────────────────────
  const payload1 = serializeCredential({
    version: 'v1',
    passId: 'EP-001',
    name: 'Pooja M',
    institution: 'Government Engineering College, Thrissur',
    passClass: 'STUDENT',
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    photoHash: demoPhotoHash,
  });
  const sig1 = await signCredential(payload1, DEMO_PRIVATE_KEY);
  const seed1 = generateSeed();

  passes.push({
    id: 'EP-001',
    studentId: 'STU-001',
    credential: payload1,
    signature: sig1,
    seed: seed1,
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    revoked: false,
    photoHash: demoPhotoHash,
    photoUrl: '',
    name: 'Pooja M',
    institution: 'Government Engineering College, Thrissur',
    passClass: 'STUDENT',
    enrolmentNo: 'GEC2024CS042',
  });

  // ── PASS 2: Another Valid Pass (for uncached/amber test) ───
  const payload2 = serializeCredential({
    version: 'v1',
    passId: 'EP-005',
    name: 'Ananya R',
    institution: 'NIT Calicut',
    passClass: 'STUDENT',
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    photoHash: demoPhotoHash5,
  });
  const sig2 = await signCredential(payload2, DEMO_PRIVATE_KEY);
  const seed5 = generateSeed();

  passes.push({
    id: 'EP-005',
    studentId: 'STU-005',
    credential: payload2,
    signature: sig2,
    seed: seed5,
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    revoked: false,
    photoHash: demoPhotoHash5,
    photoUrl: '',
    name: 'Ananya R',
    institution: 'NIT Calicut',
    passClass: 'STUDENT',
    enrolmentNo: 'NITC2024EC018',
  });

  // ── PASS 3: Expired Pass ──────────────────────────────────
  const expiredUntil = thirtyDaysAgo;
  const payload3 = serializeCredential({
    version: 'v1',
    passId: 'EP-003',
    name: 'Meera S',
    institution: 'College of Engineering, Trivandrum',
    passClass: 'STUDENT',
    validUntil: expiredUntil,
    issuedAt: thirtyDaysAgo - 90 * 24 * 60 * 60,
    photoHash: demoPhotoHash3,
  });
  const sig3 = await signCredential(payload3, DEMO_PRIVATE_KEY);
  const seed3 = generateSeed();

  passes.push({
    id: 'EP-003',
    studentId: 'STU-003',
    credential: payload3,
    signature: sig3,
    seed: seed3,
    validUntil: expiredUntil,
    issuedAt: thirtyDaysAgo - 90 * 24 * 60 * 60,
    revoked: false,
    photoHash: demoPhotoHash3,
    photoUrl: '',
    name: 'Meera S',
    institution: 'College of Engineering, Trivandrum',
    passClass: 'STUDENT',
    enrolmentNo: 'CET2023ME056',
  });

  // ── PASS 4: Revoked Pass ──────────────────────────────────
  const payload4 = serializeCredential({
    version: 'v1',
    passId: 'EP-004',
    name: 'Ravi K',
    institution: 'Model Engineering College, Kochi',
    passClass: 'STUDENT',
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    photoHash: demoPhotoHash4,
  });
  const sig4 = await signCredential(payload4, DEMO_PRIVATE_KEY);
  const seed4 = generateSeed();

  passes.push({
    id: 'EP-004',
    studentId: 'STU-004',
    credential: payload4,
    signature: sig4,
    seed: seed4,
    validUntil: ninetyDaysFromNow,
    issuedAt: nowSec,
    revoked: true,
    photoHash: demoPhotoHash4,
    photoUrl: '',
    name: 'Ravi K',
    institution: 'Model Engineering College, Kochi',
    passClass: 'STUDENT',
    enrolmentNo: 'MEC2024IT023',
  });

  revocations.push({
    passId: 'EP-004',
    reason: 'Duplicate concession detected — student holds pass from another operator',
    revokedAt: nowSec - 3600,
  });

  // ── APPLICATION 1: Depot Approved & Awaiting Payment (from PDF Page 6) ──
  applications.push({
    id: 'KSRTC-2026-18742',
    applicationNo: 'KSRTC-2026-18742',
    name: 'Archana Ajit',
    email: 'college@gmail.com',
    mobile: '01234567899',
    photoUrl: '',
    dob: '2002-03-14',
    gender: 'Female',
    address: 'Cochi Dhanushkodi Road, Varikoli, Puthenkurish, Kochi, Kerala 682308',
    institution: 'Muthoot Institute of Technology and Science, Varikoli',
    enrolmentNo: 'mzc20cs031',
    course: 'PG - Master of Computer Applications (MCA)',
    department: 'Computer Applications',
    year: '2nd Year',
    semester: 'S4',
    origin: 'Varikoli',
    destination: 'Vytilla',
    routeClass: 'STUDENT',
    transportOperator: 'KSRTC',
    depot: 'Ernakulam South Depot',
    state: 'Kerala',
    proofUrl: '',
    studentIdUrl: '',
    status: 'DEPOT_APPROVED',
    submittedAt: nowSec - 86400 * 2,
    collegeVerifiedAt: nowSec - 86400 * 1.5,
    collegeRemarks: 'Bonafide MCA student enrollment verified with College Registrar stamp.',
    depotApprovedAt: nowSec - 86400,
    depotRemarks: 'Route Varikoli-Vytilla approved for 100% Ordinary & 80% Fast Passenger concession.',
    payment: {
      amount: 120,
      status: 'PENDING',
    },
  });

  // ── APPLICATION 2: Active Pass Issued (Pooja's) ───────────
  applications.push({
    id: 'APP-003',
    applicationNo: 'KSRTC-2026-10442',
    name: 'Pooja M',
    email: 'pooja.m@email.com',
    mobile: '9876543212',
    photoUrl: '',
    dob: '2004-06-18',
    gender: 'Female',
    address: 'Swaraj Round North, Thrissur, Kerala 680001',
    institution: 'Government Engineering College, Thrissur',
    enrolmentNo: 'GEC2024CS042',
    course: 'B.Tech Computer Science',
    department: 'Computer Science',
    year: '3rd Year',
    semester: 'S5',
    origin: 'Thrissur Central',
    destination: 'Kunnamkulam Stand',
    routeClass: 'STUDENT',
    transportOperator: 'KSRTC',
    depot: 'Thrissur Central Depot',
    state: 'Kerala',
    proofUrl: '',
    studentIdUrl: '',
    status: 'APPROVED',
    submittedAt: nowSec - 86400 * 5,
    collegeVerifiedAt: nowSec - 86400 * 4.5,
    depotApprovedAt: nowSec - 86400 * 4,
    payment: {
      amount: 120,
      status: 'PAID',
      paymentId: 'PAY-UPI-992140',
      paidAt: nowSec - 86400 * 4,
      method: 'UPI · Google Pay',
    },
    approvedAt: nowSec - 86400 * 4,
  });

  // ── APPLICATION 3: Tamil Nadu (TNSTC) - College Verified ──
  applications.push({
    id: 'TNSTC-2026-0419',
    applicationNo: 'TNSTC-2026-0419',
    name: 'Karthik Sundaram',
    email: 'karthik.s@psgtech.edu',
    mobile: '9443219870',
    photoUrl: '',
    dob: '2003-11-05',
    gender: 'Male',
    address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
    institution: 'PSG College of Technology, Coimbatore',
    enrolmentNo: 'PSG22ME104',
    course: 'B.E. Mechanical Engineering',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    semester: 'S6',
    origin: 'Coimbatore Gandhipuram',
    destination: 'Tiruppur Old Bus Stand',
    routeClass: 'STUDENT',
    transportOperator: 'TNSTC',
    depot: 'Coimbatore Central Depot',
    state: 'Tamil Nadu',
    proofUrl: '',
    studentIdUrl: '',
    status: 'COLLEGE_VERIFIED',
    submittedAt: nowSec - 86400 * 1.8,
    collegeVerifiedAt: nowSec - 86400 * 1,
    collegeRemarks: 'Bonafide engineering student verified by Principal office.',
  });

  // ── APPLICATION 4: Karnataka (BMTC) - Submitted ───────────
  applications.push({
    id: 'BMTC-2026-3120',
    applicationNo: 'BMTC-2026-3120',
    name: 'Priya Nair',
    email: 'priya.n@rvce.edu.in',
    mobile: '9880123456',
    photoUrl: '',
    dob: '2005-02-22',
    gender: 'Female',
    address: 'Mysore Road, RV Vidyaniketan Post, Bangalore 560059',
    institution: 'RV College of Engineering, Bangalore',
    enrolmentNo: '1RV23IS088',
    course: 'B.E. Information Science',
    department: 'Information Science',
    year: '2nd Year',
    semester: 'S3',
    origin: 'Majestic Bus Stand',
    destination: 'Kengeri Satellite Town',
    routeClass: 'STUDENT',
    transportOperator: 'BMTC',
    depot: 'Majestic Central Depot',
    state: 'Karnataka',
    proofUrl: '',
    studentIdUrl: '',
    status: 'SUBMITTED',
    submittedAt: nowSec - 7200,
  });

  // ── APPLICATION 5: Andhra Pradesh (APSRTC) - Payment Pending
  applications.push({
    id: 'APSRTC-2026-5581',
    applicationNo: 'APSRTC-2026-5581',
    name: 'Ravi Varma',
    email: 'ravi.varma@andhrauniv.edu.in',
    mobile: '9949112233',
    photoUrl: '',
    dob: '2004-08-10',
    gender: 'Male',
    address: 'Waltair Uplands, Visakhapatnam, Andhra Pradesh 530003',
    institution: 'Andhra University College of Engineering',
    enrolmentNo: 'AU2023ECE045',
    course: 'B.Tech ECE',
    department: 'Electronics & Communication',
    year: '2nd Year',
    semester: 'S4',
    origin: 'Visakhapatnam RTC Complex',
    destination: 'Gajuwaka Junction',
    routeClass: 'STUDENT',
    transportOperator: 'APSRTC',
    depot: 'Visakhapatnam Depot',
    state: 'Andhra Pradesh',
    proofUrl: '',
    studentIdUrl: '',
    status: 'PAYMENT_PENDING',
    submittedAt: nowSec - 86400 * 3,
    collegeVerifiedAt: nowSec - 86400 * 2,
    depotApprovedAt: nowSec - 86400 * 1,
    payment: {
      amount: 150,
      status: 'PENDING',
    },
  });

  // ── APPLICATION 6: Maharashtra (MSRTC) - College Verified ─
  applications.push({
    id: 'MSRTC-2026-7814',
    applicationNo: 'MSRTC-2026-7814',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@coep.ac.in',
    mobile: '9822098765',
    photoUrl: '',
    dob: '2003-05-19',
    gender: 'Male',
    address: 'Shivajinagar, Pune, Maharashtra 411005',
    institution: 'COEP Technological University, Pune',
    enrolmentNo: 'COEP22CS071',
    course: 'B.Tech Computer Science',
    department: 'Computer Science',
    year: '3rd Year',
    semester: 'S5',
    origin: 'Swargate Bus Stand',
    destination: 'Hadapsar Gadital',
    routeClass: 'STUDENT',
    transportOperator: 'MSRTC',
    depot: 'Swargate Pune Depot',
    state: 'Maharashtra',
    proofUrl: '',
    studentIdUrl: '',
    status: 'COLLEGE_VERIFIED',
    submittedAt: nowSec - 86400 * 2,
    collegeVerifiedAt: nowSec - 86400 * 1.2,
  });

  // ── APPLICATION 7: Kerala - Submitted (Arjun) ─────────────
  applications.push({
    id: 'APP-001',
    applicationNo: 'KSRTC-2026-09142',
    name: 'Arjun P',
    email: 'arjun.p@email.com',
    mobile: '9876543210',
    photoUrl: '',
    dob: '2004-01-20',
    gender: 'Male',
    address: 'Reshmi Bhavan, Karicode, Kollam 691005',
    institution: 'TKM College of Engineering, Kollam',
    enrolmentNo: 'TKM2024CE031',
    course: 'B.Tech Civil Engineering',
    department: 'Civil Engineering',
    year: '2nd Year',
    semester: 'S3',
    origin: 'Kollam Depot',
    destination: 'Kottarakkara Stand',
    routeClass: 'STUDENT',
    transportOperator: 'KSRTC',
    depot: 'Kollam Bus Depot',
    state: 'Kerala',
    proofUrl: '',
    studentIdUrl: '',
    status: 'SUBMITTED',
    submittedAt: nowSec - 7200,
  });

  // ── APPLICATION 8: Kerala - College Verified (Sneha) ──────
  applications.push({
    id: 'APP-002',
    applicationNo: 'KSRTC-2026-11029',
    name: 'Sneha V',
    email: 'sneha.v@email.com',
    mobile: '9876543211',
    photoUrl: '',
    dob: '2005-09-12',
    gender: 'Female',
    address: 'Vennakkal House, Kecheri, Thrissur 680501',
    institution: 'Government Engineering College, Thrissur',
    enrolmentNo: 'GEC2024EE019',
    course: 'B.Tech Electrical Engineering',
    department: 'Electrical Engineering',
    year: '1st Year',
    semester: 'S1',
    origin: 'Thrissur Central',
    destination: 'Kunnamkulam Stand',
    routeClass: 'STUDENT',
    transportOperator: 'KSRTC',
    depot: 'Thrissur Central Depot',
    state: 'Kerala',
    proofUrl: '',
    studentIdUrl: '',
    status: 'COLLEGE_VERIFIED',
    submittedAt: nowSec - 3600,
    collegeVerifiedAt: nowSec - 1800,
    collegeRemarks: 'Attendance and bona fide student status confirmed.',
  });

  // ── SUSPICIOUS ACTIVITY (demo) ────────────────────────────
  suspiciousActivities.push({
    id: 'SA-001',
    passId: 'EP-002',
    type: 'DUPLICATE_USE',
    description: 'Same pass scanned on two different buses within 2 minutes — physically implausible travel.',
    scans: [
      { deviceId: 'DEV-A1B2C3D4', timestamp: nowSec - 3600, location: 'Bus KL-15-1234' },
      { deviceId: 'DEV-E5F6G7H8', timestamp: nowSec - 3480, location: 'Bus KL-07-5678' },
    ],
    detectedAt: nowSec - 3000,
    reviewed: false,
  });

  _seeded = true;
}

// ── Data Access Helpers ─────────────────────────────────────

export function getApplication(id: string): StudentApplication | undefined {
  return applications.find(a => a.id === id || a.applicationNo === id);
}

export function findApplicationByQuery(query: string): StudentApplication | undefined {
  if (!query || !query.trim()) return undefined;
  const clean = query.trim().toLowerCase();
  return applications.find(
    a => a.id.toLowerCase() === clean ||
         (a.applicationNo && a.applicationNo.toLowerCase() === clean) ||
         a.mobile.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
         a.name.toLowerCase().includes(clean)
  );
}

export function getPass(id: string): Pass | undefined {
  return passes.find(p => p.id === id);
}

export function getPassByStudentId(studentId: string): Pass | undefined {
  return passes.find(p => p.studentId === studentId);
}

export function getRosterEntries(): RosterEntry[] {
  return passes
    .filter(p => !p.revoked)
    .map(p => ({
      passId: p.id,
      seed: p.seed,
      photoHash: p.photoHash,
      name: p.name,
      institution: p.institution,
      validUntil: p.validUntil,
      photoUrl: p.photoUrl,
    }));
}

export function getRevocationList(): string[] {
  return revocations.map(r => r.passId);
}

export function getStats() {
  const now = Math.floor(Date.now() / 1000);
  return {
    pendingApplications: applications.filter(a => a.status === 'PENDING').length,
    approvedApplications: applications.filter(a => a.status === 'APPROVED').length,
    activePasses: passes.filter(p => !p.revoked && p.validUntil > now).length,
    revokedPasses: passes.filter(p => p.revoked).length,
    totalScans: scanLogs.length,
    suspiciousCount: suspiciousActivities.filter(s => !s.reviewed).length,
  };
}
