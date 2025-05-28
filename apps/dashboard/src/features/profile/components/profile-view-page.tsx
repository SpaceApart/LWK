import { UserProfile } from '@clerk/nextjs';
import { useRef } from 'react';
import SyncStatus, { SyncStatusRef } from './sync-status';
import SyncUserButton from './sync-user-button';

export default function ProfileViewPage() {
  const syncStatusRef = useRef<SyncStatusRef>(null);

  const handleSyncSuccess = () => {
    // Odśwież status po udanej synchronizacji
    if (syncStatusRef.current) {
      syncStatusRef.current.refresh();
    }
  };

  return (
    <div className='flex w-full flex-col space-y-6 p-4'>
      {/* Sekcja synchronizacji */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Synchronizacja danych</h2>
            <p className="text-sm text-muted-foreground">
              Zsynchronizuj swoje dane z systemem zarządzania treścią (CMS)
            </p>
          </div>
          
          {/* Status synchronizacji */}
          <SyncStatus ref={syncStatusRef} />
          
          {/* Przycisk synchronizacji */}
          <SyncUserButton onSyncSuccess={handleSyncSuccess} />
        </div>
      </div>

      {/* Profil użytkownika Clerk */}
      <div className="rounded-lg border bg-card">
        <UserProfile />
      </div>
    </div>
  );
}
