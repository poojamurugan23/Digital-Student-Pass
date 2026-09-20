// ============================================================
// EduPass — Offline Indicator Component
// ============================================================

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudOff } from 'lucide-react';
import { getPendingSyncCount } from '../lib/offline-store';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending sync count
    const checkPending = async () => {
      try {
        const count = await getPendingSyncCount();
        setPendingCount(count);
      } catch {
        // IndexedDB may not be available in some contexts
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-ep-mint rounded-full">
          <Wifi className="w-3.5 h-3.5 text-ep-green" />
          <span className="text-[11px] font-sans font-semibold text-ep-green">ONLINE</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-ep-amber/10 rounded-full">
          <WifiOff className="w-3.5 h-3.5 text-ep-amber" />
          <span className="text-[11px] font-sans font-semibold text-ep-amber">OFFLINE</span>
        </div>
      )}

      {pendingCount > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-ep-amber/10 rounded-full">
          <CloudOff className="w-3 h-3 text-ep-amber" />
          <span className="text-[10px] font-sans font-medium text-ep-amber">
            {pendingCount} pending
          </span>
        </div>
      )}
    </div>
  );
}
