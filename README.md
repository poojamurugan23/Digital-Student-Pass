# 🎫 Digital Student Concession Pass System (EduPass)

> A modern, tamper-proof, and offline-verifiable digital student concession pass system for State Public Road Transport Undertakings across India.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Ed25519](https://img.shields.io/badge/Cryptography-Ed25519%20%2B%20HMAC-emerald.svg)](https://noblecrypto.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

The **Digital Student Concession Pass System** digitizes and modernizes student bus concession passes for public road transport networks. Designed to support multiple state undertakings including:
- **KSRTC** — Kerala State Road Transport Corporation
- **TNSTC** — Tamil Nadu State Transport Corporation
- **BMTC** — Bangalore Metropolitan Transport Corporation
- **APSRTC** — Andhra Pradesh State Road Transport Corporation
- **MSRTC** — Maharashtra State Road Transport Corporation
- **DTC** — Delhi Transport Corporation

It eliminates paperwork, long queues, and fraudulent bus passes while providing a seamless, multi-stakeholder approval workflow and **practical offline verification** for bus conductors.

---

## 🌟 Key Workflows & Features

### 1. 🔄 5-Stage Application Lifecycle
```
[1. Student Applies] ➔ [2. College Verification] ➔ [3. Depot Approval] ➔ [4. Concession Payment] ➔ [5. Pass Issued]
```
1. **Student Registration & Application**: Students apply with academic credentials, route details, and proof documents.
2. **College Verification**: Institutional registrars verify bona fide student enrollment and forward to the transport depot.
3. **Depot Approval**: Transport depot officers inspect travel corridors, eligibility, and approve concession fares.
4. **Concession Payment Clearance**: Integrated simulated fee collection (UPI, Card, Net Banking) generating digital receipts.
5. **Sovereign Pass Issuance**: Passes are cryptographically signed using asymmetric **Ed25519** signatures.

### 2. 🛡️ Sovereign Digital QR (Practical & Innovative)
- **Practical Permanent QR (Default)**: Conductor-ready credential carrying the Ed25519 signature and verification payload for instantaneous offline boarding without impractical 30-second timeouts.
- **Dynamic Anti-Screenshot Mode (Optional Innovation)**: 30-second HMAC-SHA256 rotating token for high-security environments.

### 3. 🚌 Offline Conductor Scanner Terminal
- **Zero-Network Verification**: Works 100% offline inside rural bus routes without mobile data.
- **Microsecond Speed**: Verifies Ed25519 signature, validity period, and blacklist revocation in **< 3 milliseconds**.
- **Visual Feedback**:
  - 🟢 **VERIFIED**: Valid cryptographic signature and active roster.
  - 🟡 **LIMITED**: Valid signature, un-synced offline roster.
  - 🔴 **REJECTED**: Signature mismatch, expired credential, or forged payload.

### 4. 📊 Multi-Stakeholder Portals
- **Public Tracking Portal (`/track`)**: Real-time 5-stage progress stepper and audit timeline.
- **Analytics Dashboard (`/analytics`)**: Applications processing speed, revenue, college breakdown, and depot stats.
- **College Admin Desk (`/institution/dashboard`)**: 1-click student roster endorsement and verification queue.
- **Transport Depot Officer Desk (`/admin/applications`)**: Multi-RTC operator queue, corridor review, and credential issuance.
- **Student Account & Pass Holder (`/student/pass`, `/student/dashboard`)**: Apple Wallet-style digital pass with offline caching.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Type-safe, reactive UI architecture |
| **Bundler & Dev** | Vite 6 | Fast HMR and optimized builds |
| **Styling** | TailwindCSS + CSS Custom Properties | Warm studio beige theme (`#FAF7F2`), Fraunces headings & Montserrat typography |
| **Cryptography** | `@noble/ed25519` + `@noble/hashes` | Client-side Ed25519 signatures, HMAC-SHA256 tokens |
| **Storage & Cache** | IndexedDB (idb-keyval) + LocalStorage | PWA offline credential caching & conductor rosters |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Storage) | Scalable database, RLS policies, and document proofs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/poojamurugan23/Digital-Student-Pass.git
   cd Digital-Student-Pass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Run Cryptographic Tests**:
   ```bash
   npm run test:crypto
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets, icons, manifest
├── src/
│   ├── components/         # Reusable components (Header, DynamicQR, QRScanner, OfflineIndicator)
│   ├── lib/
│   │   ├── crypto.ts       # Ed25519 signing & offline verification engine
│   │   ├── data-store.ts   # Multi-state applications, depots & pass store
│   │   ├── offline-store.ts# IndexedDB conductor roster caching
│   │   ├── supabase.ts     # Supabase client & cloud sync
│   │   └── types.ts        # TypeScript interfaces & enums
│   ├── pages/
│   │   ├── Landing.tsx     # Hero, Tracking search, How it works, Preview
│   │   ├── Track.tsx       # 5-Stage application tracking & fee payment
│   │   ├── Analytics.tsx   # Fleet statistics, processing times & revenue
│   │   ├── Auth.tsx        # Multi-role Login & dedicated Registration forms
│   │   ├── student/        # Student application & digital pass card
│   │   ├── institution/    # College registrar verification desk
│   │   ├── admin/          # Transport depot review & issuance
│   │   └── conductor/      # Offline QR scanner & scan logs
│   ├── App.tsx             # Route declarations
│   └── main.tsx            # Application entry point
├── supabase/
│   └── schema.sql          # Database schema, RLS policies & RPC functions
└── README.md
```

---

## 🔐 Cryptographic Security Model

- **Asymmetric Signature**: Pass credentials are mathematically bound using the Transport Authority's Ed25519 private key.
- **Tamper-Evident**: Any modification to student name, route, or validity immediately invalidates the signature.
- **Zero-Knowledge Field Validation**: Bus conductors verify credentials offline using only the public key—the authority's private key never leaves the secured server.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
