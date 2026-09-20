// ============================================================
// EduPass — Conductor Terminal & Roster Sync
// Styled in warm studio beige with Fraunces & Montserrat
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ScanLine,
  RefreshCw,
  Database,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Header from '../../components/Header';
import OfflineIndicator from '../../components/OfflineIndicator';
import {
  syncRoster,
  getLastSyncTime,
  getRosterCount,
  getRevocationCount,
  getPublicKey as getCachedPublicKey,
  setPublicKey as setCachedPublicKey,
  getPendingSyncCount,
  getPendingScanLogs,
  markScanSynced,
} from '../../lib/offline-store';
import { getDemoPublicKey, getRosterEntries, getRevocationList } from '../../lib/data-store';
import { fetchRosterFromSupabase, syncScanLogToSupabase } from '../../lib/supabase';
import type { RosterEntry } from '../../lib/types';

export default function ConductorHome() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [rosterCount, setRosterCount] = useState(0);
  const [revocationCount, setRevocationCount] = useState(0);
  const [hasPublicKey, setHasPublicKey] = useState(false);
  const [pendingScans, setPendingScans] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const loadStats = useCallback(async () => {
    const [ls, rc, rvc, pk, ps] = await Promise.all([
      getLastSyncTime(),
      getRosterCount(),
      getRevocationCount(),
      getCachedPublicKey(),
      getPendingSyncCount(),
    ]);
    setLastSync(ls || null);
    setRosterCount(rc);
    setRevocationCount(rvc);
    setHasPublicKey(!!pk);
    setPendingScans(ps);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      // 1. Sync pending offline scan logs to Supabase
      try {
        const pendingLogs = await getPendingScanLogs();
        for (const log of pendingLogs) {
          const synced = await syncScanLogToSupabase(log);
          if (synced) {
            await markScanSynced(log.id);
          }
        }
      } catch (err) {
        console.warn('Pending scan log sync notice:', err);
      }

      // 2. Get public key
      const pk = await getDemoPublicKey();
      await setCachedPublicKey(pk);

      // 3. Fetch from Supabase and merge with local roster
      const remoteRoster = await fetchRosterFromSupabase();
      const localRoster = getRosterEntries();
      const mergedMap = new Map<string, RosterEntry>();
      for (const r of localRoster) mergedMap.set(r.passId, r);
      for (const r of remoteRoster) mergedMap.set(r.passId, r);

      const finalRoster = Array.from(mergedMap.values());
      const revocList = getRevocationList();

      // 4. Store in IndexedDB
      await syncRoster(finalRoster, revocList);

      setSyncSuccess(true);
      await loadStats();

      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18181B] flex flex-col selection:bg-[#18181B] selection:text-white pb-16">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 pt-8 pb-12 w-full">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E6D66] font-bold">
              KSRTC Fleet Operations
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              Conductor Terminal
            </h1>
            <p className="font-sans text-xs text-[#6E6D66] mt-0.5">
              Trivandrum Central Depot · Route Corridor #441
            </p>
          </div>

          <OfflineIndicator />
        </div>

        {/* Primary Launch Scanner Button */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link
            to="/conductor/scan"
            className="flex items-center justify-between p-5 bg-[#18181B] text-white rounded-2xl hover:bg-[#2A2A2E] transition-all shadow-md active:scale-[0.99] group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <ScanLine className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Launch Camera Scanner
                </h2>
                <p className="font-sans text-xs text-stone-300">
                  Instant offline verification · Under 5ms
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        {/* Sync Roster Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E5E0D6] rounded-xl hover:border-[#18181B] transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#18181B] shrink-0">
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin text-[#23533D]' : ''}`} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-[#18181B]">
                  {syncing ? 'Synchronizing Cloud Roster...' : 'Synchronize Roster & Keys'}
                </h3>
                <p className="font-sans text-xs text-[#6E6D66]">
                  Download active credentials & sync offline scan ledger with Supabase
                </p>
              </div>
            </div>

            <span className="text-xs font-sans font-semibold text-[#18181B] bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E5E0D6]">
              Sync Now
            </span>
          </button>

          {syncSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-sans font-medium"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Roster cache & public key synchronized successfully into IndexedDB.</span>
            </motion.div>
          )}
        </motion.div>

        {/* Local IndexedDB Cache Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6 font-sans"
        >
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D6] shadow-sm">
            <div className="flex items-center gap-2 text-[#6E6D66] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Last Synced</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#18181B]">
              {lastSync
                ? new Date(lastSync).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Initial Setup'}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E0D6] shadow-sm">
            <div className="flex items-center gap-2 text-[#6E6D66] mb-1">
              <Database className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Roster Entries</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#18181B]">
              {rosterCount.toLocaleString()} Active Passes
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E0D6] shadow-sm">
            <div className="flex items-center gap-2 text-[#6E6D66] mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Issuer Public Key</span>
            </div>
            <div className="font-mono font-bold text-sm text-emerald-700">
              {hasPublicKey ? 'Ed25519 Cached' : 'Missing'}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E5E0D6] shadow-sm">
            <div className="flex items-center gap-2 text-[#6E6D66] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Revocation Blacklist</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#18181B]">
              {revocationCount} Records
            </div>
          </div>
        </motion.div>

        {/* Pending Offline Ledger Notice */}
        {pendingScans > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 flex items-center justify-between text-xs font-sans text-amber-900">
            <span>
              <strong>{pendingScans}</strong> verification record{pendingScans > 1 ? 's' : ''}{' '}
              queued in offline IndexedDB.
            </span>
            <button
              onClick={handleSync}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-bold transition-colors"
            >
              Push to Cloud
            </button>
          </div>
        )}

        {/* Scan Log History Link */}
        <Link
          to="/conductor/log"
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#18181B] transition-all text-xs font-sans shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-[#6E6D66]" />
            <span className="font-bold text-[#18181B]">View On-Bus Scan History</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6E6D66]" />
        </Link>
      </main>
    </div>
  );
}
