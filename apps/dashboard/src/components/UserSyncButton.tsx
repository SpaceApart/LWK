'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

interface SyncStatus {
  synchronized: boolean;
  clerkId: string;
  payloadUser: any | null;
}

export default function UserSyncButton() {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSyncStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payload/sync-user', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check sync status');
      }

      const data = await response.json();
      setSyncStatus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error checking sync status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncUser = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payload/sync-user', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync user');
      }

      const data = await response.json();
      console.log('Sync result:', data);
      
      // Sprawdź status po synchronizacji
      await checkSyncStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error syncing user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="p-4">Loading user data...</div>;
  }

  if (!user) {
    return <div className="p-4">Please sign in to sync your account.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">Account Synchronization</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Clerk ID:</strong> {user.id}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
      </div>

      {syncStatus && (
        <div className="mb-4 p-3 rounded-md bg-gray-50">
          <p className="text-sm">
            <strong>Sync Status:</strong>{' '}
            <span className={syncStatus.synchronized ? 'text-green-600' : 'text-red-600'}>
              {syncStatus.synchronized ? 'Synchronized' : 'Not Synchronized'}
            </span>
          </p>
          {syncStatus.payloadUser && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(syncStatus.payloadUser.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={checkSyncStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
        
        <button
          onClick={syncUser}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          This will create or update your account in the Payload CMS system.
          Normally this happens automatically when you register, but you can manually sync here if needed.
        </p>
      </div>
    </div>
  );
} 