// ============================================================
// EduPass — Supabase Authentication & Role Context
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'admin' | 'conductor' | 'authority' | 'institution';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institution?: string;
  badgeNumber?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    institution?: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: 'demo-student-001',
    email: 'pooja.m@cet.ac.in',
    fullName: 'Pooja M',
    role: 'student',
    institution: 'College of Engineering Trivandrum',
  },
  conductor: {
    id: 'demo-conductor-002',
    email: 'conductor.rajesh@ksrtc.gov.in',
    fullName: 'Rajesh Kumar',
    role: 'conductor',
    badgeNumber: 'KSRTC-4481',
  },
  admin: {
    id: 'demo-admin-003',
    email: 'admin.nair@ksrtc.kerala.gov.in',
    fullName: 'Officer S. Nair',
    role: 'admin',
    institution: 'KSRTC Central Concession Cell',
  },
  authority: {
    id: 'demo-authority-004',
    email: 'director@dce.kerala.gov.in',
    fullName: 'Dr. V. Menon',
    role: 'authority',
    institution: 'Directorate of Collegiate Education',
  },
  institution: {
    id: 'demo-institution-005',
    email: 'principal@cet.ac.in',
    fullName: 'Dean of Student Affairs',
    role: 'institution',
    institution: 'College of Engineering Trivandrum',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    // Default to student for seamless judge walkthrough
    const saved = localStorage.getItem('edupass_active_role') as UserRole | null;
    return DEMO_PROFILES[saved || 'student'];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check real Supabase Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setProfile({
          id: session.user.id,
          email: session.user.email || '',
          fullName: metadata.full_name || session.user.email?.split('@')[0] || 'User',
          role: (metadata.role as UserRole) || 'student',
          institution: metadata.institution,
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setProfile({
          id: session.user.id,
          email: session.user.email || '',
          fullName: metadata.full_name || session.user.email?.split('@')[0] || 'User',
          role: (metadata.role as UserRole) || 'student',
          institution: metadata.institution,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error };
      if (data.user) {
        const meta = data.user.user_metadata || {};
        setProfile({
          id: data.user.id,
          email: data.user.email || '',
          fullName: meta.full_name || email.split('@')[0],
          role: (meta.role as UserRole) || 'student',
          institution: meta.institution,
        });
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    institution?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            role,
            institution,
          },
        },
      });
      if (error) return { error };
      if (data.user) {
        setProfile({
          id: data.user.id,
          email,
          fullName,
          role,
          institution,
        });
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(DEMO_PROFILES.student);
    localStorage.removeItem('edupass_active_role');
  };

  const quickLoginAs = (role: UserRole) => {
    const p = DEMO_PROFILES[role];
    setProfile(p);
    localStorage.setItem('edupass_active_role', role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || 'student',
        loading,
        signIn,
        signUp,
        signOut,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
