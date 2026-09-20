// ============================================================
// EduPass — Core Types
// ============================================================

// Credential payload format: v1|passId|name|institution|passClass|validUntil|issuedAt|photoHash
export interface CredentialPayload {
  version: string;
  passId: string;
  name: string;
  institution: string;
  passClass: string;
  validUntil: number;   // unix timestamp (seconds)
  issuedAt: number;     // unix timestamp (seconds)
  photoHash: string;
}

export interface SignedCredential {
  payload: string;      // canonical pipe-delimited string
  signature: string;    // hex-encoded Ed25519 signature
}

export interface QRData {
  credential: string;   // base64url(payload)
  signature: string;    // base64url(signature bytes)
  rotatingCode: string; // 8-char hex HMAC fragment
}

export type VerificationStatus = 'VERIFIED' | 'LIMITED' | 'REJECTED';

export interface VerificationResult {
  status: VerificationStatus;
  credential?: CredentialPayload;
  reason?: string;
  verificationTimeMs: number;
  observedSkewMs: number;
  photoHash?: string;
  timestamp: number;
}

// Roster entry cached in IndexedDB
export interface RosterEntry {
  passId: string;
  seed: string;         // hex-encoded HMAC seed
  photoHash: string;
  name: string;
  institution: string;
  validUntil: number;
  photoUrl?: string;
}

// Scan log stored in IndexedDB
export interface ScanLog {
  id: string;
  passId: string;
  deviceId: string;
  timestamp: number;
  result: VerificationStatus;
  reason?: string;
  verificationMode: 'OFFLINE' | 'ONLINE';
  verificationTimeMs: number;
  observedSkewMs: number;
  syncStatus: 'PENDING' | 'SYNCED';
  syncId: string;
}

// Application Lifecycle Stages matching official transport workflow
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'COLLEGE_VERIFIED'
  | 'DEPOT_APPROVED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING'
  | 'CORRECTION_REQUIRED';

export interface StudentApplication {
  id: string;
  applicationNo?: string; // Formatted reference e.g. KSRTC-2026-18742
  // Personal
  name: string;
  email: string;
  mobile: string;
  photoUrl: string;
  dob?: string;
  gender?: string;
  address?: string;
  // Institution
  institution: string;
  enrolmentNo: string;
  course: string;
  department: string;
  year: string;
  semester?: string;
  // Travel & Transport
  origin: string;
  destination: string;
  routeClass: string;
  transportOperator: string; // KSRTC, TNSTC, BMTC, APSRTC, MSRTC, etc.
  depot?: string;            // Regional bus depot
  state?: string;
  // Proof
  proofUrl: string;
  studentIdUrl: string;
  // Workflow Multi-Tier Status
  status: ApplicationStatus;
  submittedAt: number;
  collegeVerifiedAt?: number;
  collegeRemarks?: string;
  depotApprovedAt?: number;
  depotRemarks?: string;
  payment?: {
    amount: number;
    status: 'PENDING' | 'PAID';
    paymentId?: string;
    paidAt?: number;
    method?: string;
  };
  approvedAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
}

// Pass
export interface Pass {
  id: string;
  studentId: string;
  credential: string;     // base64url encoded signed credential
  signature: string;       // hex encoded signature
  seed: string;            // hex encoded HMAC seed
  validUntil: number;
  issuedAt: number;
  revoked: boolean;
  photoHash: string;
  photoUrl: string;
  name: string;
  institution: string;
  passClass: string;
  enrolmentNo: string;
}

// Revocation
export interface Revocation {
  passId: string;
  reason: string;
  revokedAt: number;
}

// Transport operator configuration
export interface TransportOperator {
  id: string;
  name: string;
  state: string;
  routes: string[];
  concessionClasses: string[];
  validityPeriodDays: number;
}

// Suspicious activity
export interface SuspiciousActivity {
  id: string;
  passId: string;
  type: 'DUPLICATE_USE' | 'IMPOSSIBLE_TRAVEL';
  description: string;
  scans: { deviceId: string; timestamp: number; location?: string }[];
  detectedAt: number;
  reviewed: boolean;
}
