import { useEffect, useState } from 'react';
import { apiClient } from './client';

// Pings a real, existing, cheap endpoint (flight list) to reflect actual
// backend reachability — not a simulated/fake indicator.
export function useBackendStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get('/flight/list')
      .then(() => {
        if (!cancelled) setStatus('online');
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
