import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

interface UserProfileUpdateData {
    firstName?: string;
    lastName?: string;
}

export async function PATCH(request: NextRequest) {
    if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
        return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
    }

    const { userId: clerkId } = getAuth(request);

    if (!clerkId) {
        return NextResponse.json({ error: 'Unauthorized: User not authenticated via Clerk' }, { status: 401 });
    }

    let updateData: UserProfileUpdateData;
    try {
        updateData = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { firstName, lastName } = updateData;

    if (!firstName && !lastName) {
        return NextResponse.json({ error: 'At least one field (firstName or lastName) must be provided for update' }, { status: 400 });
    }

    try {
        // 1. Znajdź ID dokumentu DashboardUser w Payload na podstawie clerkId
        const findUserResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}&limit=1&depth=0`, {
            method: 'GET',
            headers: {
                // Do wyszukania ID użytkownika na podstawie clerkId używamy klucza API systemu,
                // ponieważ to operacja systemowa, a nie w imieniu użytkownika.
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
            },
        });

        if (!findUserResponse.ok) {
            const errorText = await findUserResponse.text();
            console.error('Error fetching dashboard user for update:', findUserResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to find dashboard user in Payload', details: errorText }, { status: findUserResponse.status });
        }

        const findUserData = await findUserResponse.json();
        if (!findUserData.docs || findUserData.docs.length === 0) {
            return NextResponse.json({ error: 'Dashboard user not found in Payload. Cannot update profile.' }, { status: 404 });
        }
        const payloadDashboardUserDocId = findUserData.docs[0].id;

        // 2. Przygotuj dane do aktualizacji
        const fieldsToUpdate: Partial<UserProfileUpdateData> = {};
        if (firstName) fieldsToUpdate.firstName = firstName;
        if (lastName) fieldsToUpdate.lastName = lastName;

        // 3. Zaktualizuj dokument DashboardUser w Payload CMS używając jego ID
        const clerkToken = request.headers.get('Authorization')?.split(' ')?.[1];
        if (!clerkToken) {
            console.error('Clerk token not found in request headers for PATCH to dashboard-user');
            return NextResponse.json({ error: 'Clerk token missing, cannot authenticate with Payload for update' }, { status: 401 });
        }

        const updateUserResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users/${payloadDashboardUserDocId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${clerkToken}`, // Przekazanie tokenu JWT Clerka do Payload
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fieldsToUpdate),
        });

        if (!updateUserResponse.ok) {
            const errorText = await updateUserResponse.text();
            console.error('Error updating user profile in Payload:', updateUserResponse.status, errorText);
            let errorDetails: any = errorText;
            try {
                errorDetails = JSON.parse(errorText);
            } catch (e) { /* ignore parsing error */ }

            if (updateUserResponse.status === 403) {
                return NextResponse.json({ error: 'Forbidden: You may not have permission to update this profile, or the data is invalid.', details: errorDetails }, { status: 403 });
            }
            return NextResponse.json({ error: 'Failed to update user profile in Payload', details: errorDetails }, { status: updateUserResponse.status });
        }

        const updatedUser = await updateUserResponse.json();

        return NextResponse.json({ message: 'User profile updated successfully', data: updatedUser.doc || updatedUser }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Internal server error while updating user profile', details: errorMessage }, { status: 500 });
    }
} 