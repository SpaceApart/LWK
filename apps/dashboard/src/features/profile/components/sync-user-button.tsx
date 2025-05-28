'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SyncResponse {
  success?: boolean;
  message?: string;
  operation?: string;
  data?: any;
  error?: string;
}

interface SyncUserButtonProps {
  onSyncSuccess?: () => void;
}

export default function SyncUserButton({ onSyncSuccess }: SyncUserButtonProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'error' | null>(null);

  const handleSync = async () => {
    if (!user) {
      toast.error('Nie jesteś zalogowany');
      return;
    }

    setIsLoading(true);
    setLastSyncStatus(null);

    try {
      const response = await fetch('/api/payload/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: SyncResponse = await response.json();

      if (response.ok && !data.error) {
        setLastSyncStatus('success');
        const operation = data.operation === 'created' ? 'utworzono' : 'zaktualizowano';
        toast.success(data.message || `Pomyślnie ${operation} użytkownika w CMS`);
        
        // Wywołaj callback po udanej synchronizacji
        if (onSyncSuccess) {
          onSyncSuccess();
        }
      } else {
        setLastSyncStatus('error');
        toast.error(data.error || data.message || 'Błąd podczas synchronizacji');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setLastSyncStatus('error');
      toast.error('Wystąpił błąd podczas synchronizacji');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (lastSyncStatus === 'success') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (lastSyncStatus === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <RefreshCw className="h-4 w-4" />;
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Synchronizuję...';
    }
    if (lastSyncStatus === 'success') {
      return 'Zsynchronizowano';
    }
    if (lastSyncStatus === 'error') {
      return 'Błąd - spróbuj ponownie';
    }
    return 'Synchronizuj z CMS';
  };

  const getButtonVariant = () => {
    if (lastSyncStatus === 'success') {
      return 'outline' as const;
    }
    if (lastSyncStatus === 'error') {
      return 'destructive' as const;
    }
    return 'default' as const;
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleSync}
        disabled={isLoading}
        variant={getButtonVariant()}
        className="w-full sm:w-auto"
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </Button>
      
      <p className="text-sm text-muted-foreground">
        Synchronizuj swoje dane z systemem zarządzania treścią
      </p>
    </div>
  );
} 