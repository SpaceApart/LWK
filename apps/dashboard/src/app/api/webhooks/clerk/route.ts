import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

interface ClerkUserData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  username: string | null;
  last_sign_in_at: number | null;
  created_at: number;
  banned: boolean;
  locked: boolean;
}

// Funkcja do weryfikacji webhook signature (uproszczona wersja)
async function verifyWebhookSignature(request: NextRequest): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return false;
  }

  // W produkcji należy użyć biblioteki svix do pełnej weryfikacji
  // Na razie sprawdzamy tylko obecność nagłówków
  const headersList = headers();
  const svixId = headersList.get('svix-id');
  const svixTimestamp = headersList.get('svix-timestamp');
  const svixSignature = headersList.get('svix-signature');

  return !!(svixId && svixTimestamp && svixSignature);
}

// Funkcja do tworzenia użytkownika w Payload CMS
async function createUserInPayload(userData: ClerkUserData): Promise<boolean> {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    console.error('Payload API configuration missing');
    return false;
  }

  const primaryEmail = userData.email_addresses.find(email => email.id === userData.email_addresses[0]?.id);
  
  if (!primaryEmail) {
    console.error('No primary email found for user:', userData.id);
    return false;
  }

  const payloadUserData = {
    clerkId: userData.id,
    email: primaryEmail.email_address,
    firstName: userData.first_name || '',
    lastName: userData.last_name || '',
    imageUrl: userData.image_url || '',
    username: userData.username || '',
    lastSignInAt: userData.last_sign_in_at ? new Date(userData.last_sign_in_at) : null,
    createdAt: new Date(userData.created_at),
    banned: userData.banned || false,
    locked: userData.locked || false,
  };

  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users`, {
      method: 'POST',
      headers: {
        'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadUserData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create user in Payload:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('User created successfully in Payload:', result.doc?.id);
    return true;
  } catch (error) {
    console.error('Error creating user in Payload:', error);
    return false;
  }
}

// Funkcja do aktualizacji użytkownika w Payload CMS
async function updateUserInPayload(userData: ClerkUserData): Promise<boolean> {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    console.error('Payload API configuration missing');
    return false;
  }

  try {
    // Znajdź użytkownika po clerkId
    const findResponse = await fetch(
      `${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${userData.id}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        },
      }
    );

    if (!findResponse.ok) {
      console.error('Failed to find user in Payload:', findResponse.status);
      return false;
    }

    const findResult = await findResponse.json();
    
    if (!findResult.docs || findResult.docs.length === 0) {
      console.log('User not found in Payload, creating new user');
      return await createUserInPayload(userData);
    }

    const payloadUserId = findResult.docs[0].id;
    const primaryEmail = userData.email_addresses.find(email => email.id === userData.email_addresses[0]?.id);

    const updateData = {
      email: primaryEmail?.email_address || findResult.docs[0].email,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      imageUrl: userData.image_url || '',
      username: userData.username || '',
      lastSignInAt: userData.last_sign_in_at ? new Date(userData.last_sign_in_at) : null,
      banned: userData.banned || false,
      locked: userData.locked || false,
    };

    const updateResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users/${payloadUserId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update user in Payload:', updateResponse.status, errorText);
      return false;
    }

    console.log('User updated successfully in Payload:', payloadUserId);
    return true;
  } catch (error) {
    console.error('Error updating user in Payload:', error);
    return false;
  }
}

// Funkcja do usuwania użytkownika z Payload CMS
async function deleteUserInPayload(clerkId: string): Promise<boolean> {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    console.error('Payload API configuration missing');
    return false;
  }

  try {
    // Znajdź użytkownika po clerkId
    const findResponse = await fetch(
      `${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        },
      }
    );

    if (!findResponse.ok) {
      console.error('Failed to find user in Payload:', findResponse.status);
      return false;
    }

    const findResult = await findResponse.json();
    
    if (!findResult.docs || findResult.docs.length === 0) {
      console.log('User not found in Payload for deletion');
      return true; // Nie ma czego usuwać
    }

    const payloadUserId = findResult.docs[0].id;

    const deleteResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users/${payloadUserId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Failed to delete user in Payload:', deleteResponse.status, errorText);
      return false;
    }

    console.log('User deleted successfully from Payload:', payloadUserId);
    return true;
  } catch (error) {
    console.error('Error deleting user from Payload:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Weryfikacja webhook signature
    const isValid = await verifyWebhookSignature(request);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parsowanie payload
    const payload: WebhookEvent = await request.json();
    console.log('Received webhook event:', payload.type);

    // Obsługa różnych typów eventów
    switch (payload.type) {
      case 'user.created':
        const createdUser = payload.data as ClerkUserData;
        const createSuccess = await createUserInPayload(createdUser);
        if (!createSuccess) {
          return NextResponse.json({ error: 'Failed to create user in Payload' }, { status: 500 });
        }
        break;

      case 'user.updated':
        const updatedUser = payload.data as ClerkUserData;
        const updateSuccess = await updateUserInPayload(updatedUser);
        if (!updateSuccess) {
          return NextResponse.json({ error: 'Failed to update user in Payload' }, { status: 500 });
        }
        break;

      case 'user.deleted':
        const deletedUser = payload.data as { id: string };
        const deleteSuccess = await deleteUserInPayload(deletedUser.id);
        if (!deleteSuccess) {
          return NextResponse.json({ error: 'Failed to delete user in Payload' }, { status: 500 });
        }
        break;

      case 'session.created':
        // Opcjonalnie: aktualizuj lastSignInAt
        const sessionUser = payload.data as { user_id: string };
        console.log('User signed in:', sessionUser.user_id);
        break;

      default:
        console.log('Unhandled webhook event type:', payload.type);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Endpoint testowy
export async function GET() {
  return NextResponse.json({ 
    message: 'Clerk webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
} 