'use client';

import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface SyncStatusResponse {
  synchronized: boolean;
  clerkId: string;
  payloadUser?: any;
  error?: string;
}

export interface SyncStatusRef {
  refresh: () => void;
}

const SyncStatus = forwardRef<SyncStatusRef>((props, ref) => {
  const { user } = useUser();
  const [status, setStatus] = useState<'loading' | 'synchronized' | 'not-synchronized' | 'error'>('loading');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkSyncStatus = async () => {
    if (!user) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/payload/sync-user', {
        method: 'GET',
      });

      const data: SyncStatusResponse = await response.json();

      if (response.ok && !data.error) {
        setStatus(data.synchronized ? 'synchronized' : 'not-synchronized');
      } else {
        setStatus('error');
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking sync status:', error);
      setStatus('error');
      setLastChecked(new Date());
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: checkSyncStatus,
  }));

  useEffect(() => {
    checkSyncStatus();
  }, [user]);

  const getStatusBadge = () => {
    switch (status) {
      case 'loading':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sprawdzam...
          </Badge>
        );
      case 'synchronized':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3" />
            Zsynchronizowany
          </Badge>
        );
      case 'not-synchronized':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3" />
            Nie zsynchronizowany
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Błąd sprawdzania
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'synchronized':
        return 'Twoje dane są zsynchronizowane z systemem CMS.';
      case 'not-synchronized':
        return 'Twoje dane nie są jeszcze zsynchronizowane z systemem CMS.';
      case 'error':
        return 'Wystąpił błąd podczas sprawdzania statusu synchronizacji.';
      default:
        return 'Sprawdzam status synchronizacji...';
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Status synchronizacji:</span>
        {getStatusBadge()}
      </div>
      
      <p className="text-xs text-muted-foreground">
        {getStatusDescription()}
      </p>
      
      {lastChecked && (
        <p className="text-xs text-muted-foreground">
          Ostatnie sprawdzenie: {lastChecked.toLocaleTimeString('pl-PL')}
        </p>
      )}
    </div>
  );
});

SyncStatus.displayName = 'SyncStatus';

export default SyncStatus; 