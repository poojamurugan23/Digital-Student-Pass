import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { seedDemoData } from './lib/data-store';
import { AuthProvider } from './lib/auth-context';

// Pages
import Review from './pages/Review';
import Landing from './pages/Landing';
import AuthPage from './pages/Auth';
import TrackApplication from './pages/Track';
import AnalyticsDashboard from './pages/Analytics';
import StudentPass from './pages/student/Pass';
import StudentApply from './pages/student/Apply';
import StudentDashboard from './pages/student/Dashboard';
import ConductorHome from './pages/conductor/Home';
import ConductorScan from './pages/conductor/Scan';
import ConductorLog from './pages/conductor/Log';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AuthorityDashboard from './pages/authority/Dashboard';
import InstitutionDashboard from './pages/institution/Dashboard';
import ForgedPass from './pages/review/ForgedPass';
import ExpiredPass from './pages/review/ExpiredPass';
import RevokedPass from './pages/review/RevokedPass';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDemoData().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ep-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-ep-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-ep-muted text-sm font-medium tracking-wide">Initializing EduPass...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/track" element={<TrackApplication />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/review/forged" element={<ForgedPass />} />
          <Route path="/review/expired" element={<ExpiredPass />} />
          <Route path="/review/revoked" element={<RevokedPass />} />
          <Route path="/student/apply" element={<StudentApply />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/pass" element={<StudentPass />} />
          <Route path="/conductor" element={<ConductorHome />} />
          <Route path="/conductor/scan" element={<ConductorScan />} />
          <Route path="/conductor/log" element={<ConductorLog />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
