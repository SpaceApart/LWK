import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

export async function POST(request: NextRequest) {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
  }

  const { userId: clerkId } = getAuth(request);

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized: User not authenticated via Clerk' }, { status: 401 });
  }

  try {
    // Pobierz dane użytkownika z Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
    }

    // Sprawdź czy użytkownik już istnieje w Payload
    const findUserResponse = await fetch(
      `${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        },
      }
    );

    if (!findUserResponse.ok) {
      const errorText = await findUserResponse.text();
      console.error('Error checking existing user in Payload:', findUserResponse.status, errorText);
      return NextResponse.json({ error: 'Failed to check existing user in Payload' }, { status: findUserResponse.status });
    }

    const findUserData = await findUserResponse.json();
    const userExists = findUserData.docs && findUserData.docs.length > 0;

    // Przygotuj dane użytkownika
    const primaryEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId);

    if (!primaryEmail) {
      return NextResponse.json({ error: 'No primary email found for user' }, { status: 400 });
    }

    const payloadUserData = {
      clerkId: clerkUser.id,
      email: primaryEmail.emailAddress,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl || '',
      username: clerkUser.username || '',
      lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : null,
      createdAt: new Date(clerkUser.createdAt),
      banned: clerkUser.banned || false,
      locked: clerkUser.locked || false,
    };

    let response;
    let operation;

    if (userExists) {
      // Aktualizuj istniejącego użytkownika
      const payloadUserId = findUserData.docs[0].id;
      response = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users/${payloadUserId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadUserData),
      });
      operation = 'updated';
    } else {
      // Utwórz nowego użytkownika
      response = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users`, {
        method: 'POST',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadUserData),
      });
      operation = 'created';
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to ${operation} user in Payload:`, response.status, errorText);
      return NextResponse.json({ error: `Failed to ${operation} user in Payload`, details: errorText }, { status: response.status });
    }

    const result = await response.json();

    return NextResponse.json({
      message: `User ${operation} successfully in Payload`,
      operation,
      data: result.doc || result
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error while syncing user', details: errorMessage }, { status: 500 });
  }
}

// Endpoint do sprawdzenia statusu synchronizacji
export async function GET(request: NextRequest) {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
  }

  const { userId: clerkId } = getAuth(request);

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized: User not authenticated via Clerk' }, { status: 401 });
  }

  try {
    // Sprawdź czy użytkownik istnieje w Payload
    const findUserResponse = await fetch(
      `${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        },
      }
    );

    if (!findUserResponse.ok) {
      const errorText = await findUserResponse.text();
      console.error('Error checking user in Payload:', findUserResponse.status, errorText);
      return NextResponse.json({ error: 'Failed to check user in Payload' }, { status: findUserResponse.status });
    }

    const findUserData = await findUserResponse.json();
    const userExists = findUserData.docs && findUserData.docs.length > 0;

    return NextResponse.json({
      synchronized: userExists,
      clerkId,
      payloadUser: userExists ? findUserData.docs[0] : null,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking sync status:', error);
    return NextResponse.json({ error: 'Internal server error while checking sync status', details: errorMessage }, { status: 500 });
  }
} 