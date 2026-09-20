// ============================================================
// EduPass — IndexedDB Offline Store
// ============================================================
// Used by the Conductor PWA to cache:
//   - Issuer public key
//   - Roster entries (passId → seed, photoHash, etc.)
//   - Revocation list
//   - Scan logs (pending sync)
//   - Sync metadata
// ============================================================

import { get, set, del, entries, keys, createStore } from 'idb-keyval';
import type { RosterEntry, ScanLog } from './types';

// ── Custom IndexedDB Stores ─────────────────────────────────

const rosterStore = createStore('edupass-roster', 'roster');
const scanStore = createStore('edupass-scans', 'scans');
const metaStore = createStore('edupass-meta', 'meta');
const revocationStore = createStore('edupass-revocations', 'revocations');

// ── Device ID ───────────────────────────────────────────────

let _deviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (_deviceId) return _deviceId;
  let id = await get<string>('deviceId', metaStore);
  if (!id) {
    id = 'DEV-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    await set('deviceId', id, metaStore);
  }
  _deviceId = id;
  return id;
}

// ── Public Key ──────────────────────────────────────────────

export async function getPublicKey(): Promise<string | undefined> {
  return get<string>('publicKey', metaStore);
}

export async function setPublicKey(key: string): Promise<void> {
  await set('publicKey', key, metaStore);
}

// ── Roster ──────────────────────────────────────────────────

export async function getRosterEntry(passId: string): Promise<RosterEntry | undefined> {
  return get<RosterEntry>(passId, rosterStore);
}

export async function setRosterEntry(entry: RosterEntry): Promise<void> {
  await set(entry.passId, entry, rosterStore);
}

export async function getAllRosterEntries(): Promise<RosterEntry[]> {
  const allEntries = await entries<string, RosterEntry>(rosterStore);
  return allEntries.map(([, v]) => v);
}

export async function clearRoster(): Promise<void> {
  const allKeys = await keys(rosterStore);
  for (const key of allKeys) {
    await del(key, rosterStore);
  }
}

export async function getRosterCount(): Promise<number> {
  const allKeys = await keys(rosterStore);
  return allKeys.length;
}

export async function getRosterAsMap(): Promise<Map<string, RosterEntry>> {
  const allEntries = await entries<string, RosterEntry>(rosterStore);
  return new Map(allEntries);
}

// ── Revocations ─────────────────────────────────────────────

export async function addRevocation(passId: string): Promise<void> {
  await set(passId, true, revocationStore);
}

export async function isRevoked(passId: string): Promise<boolean> {
  const val = await get<boolean>(passId, revocationStore);
  return val === true;
}

export async function getRevocationsSet(): Promise<Set<string>> {
  const allKeys = await keys<string>(revocationStore);
  return new Set(allKeys);
}

export async function getRevocationCount(): Promise<number> {
  const allKeys = await keys(revocationStore);
  return allKeys.length;
}

export async function clearRevocations(): Promise<void> {
  const allKeys = await keys(revocationStore);
  for (const key of allKeys) {
    await del(key, revocationStore);
  }
}

// ── Scan Logs ───────────────────────────────────────────────

export async function addScanLog(log: ScanLog): Promise<void> {
  await set(log.id, log, scanStore);
}

export async function getAllScanLogs(): Promise<ScanLog[]> {
  const allEntries = await entries<string, ScanLog>(scanStore);
  return allEntries.map(([, v]) => v).sort((a, b) => b.timestamp - a.timestamp);
}

export async function getPendingScanLogs(): Promise<ScanLog[]> {
  const all = await getAllScanLogs();
  return all.filter(l => l.syncStatus === 'PENDING');
}

export async function markScanSynced(id: string): Promise<void> {
  const log = await get<ScanLog>(id, scanStore);
  if (log) {
    log.syncStatus = 'SYNCED';
    await set(id, log, scanStore);
  }
}

export async function getPendingSyncCount(): Promise<number> {
  const pending = await getPendingScanLogs();
  return pending.length;
}

// ── Sync Metadata ───────────────────────────────────────────

export async function getLastSyncTime(): Promise<number | undefined> {
  return get<number>('lastSyncTime', metaStore);
}

export async function setLastSyncTime(time: number): Promise<void> {
  await set('lastSyncTime', time, metaStore);
}

// ── Bulk Sync Operations ────────────────────────────────────

export async function syncRoster(rosterEntries: RosterEntry[], revocations: string[]): Promise<void> {
  // Clear and repopulate roster
  await clearRoster();
  for (const entry of rosterEntries) {
    await setRosterEntry(entry);
  }

  // Clear and repopulate revocations
  await clearRevocations();
  for (const passId of revocations) {
    await addRevocation(passId);
  }

  await setLastSyncTime(Date.now());
}
