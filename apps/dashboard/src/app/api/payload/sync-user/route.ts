import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getAuth } from '@clerk/nextjs/server'; // Do pobrania danych użytkownika po stronie serwera

// Zakładamy, że PAYLOAD_API_URL i PAYLOAD_API_KEY są zdefiniowane w zmiennych środowiskowych
const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name?: string;
  last_name?: string;
  // Można dodać inne potrzebne pola z obiektu użytkownika Clerk
}

async function verifyClerkToken(token: string): Promise<ClerkUser | null> {
  try {
    // Weryfikacja tokenu JWT od Clerk - to jest uproszczony przykład.
    // W rzeczywistości Clerk SDK (getAuth lub inne metody) powinno być używane do bezpiecznej weryfikacji i pobierania danych użytkownika.
    // Poniższy kod jest tylko placeholderem i wymaga dostosowania do rzeczywistej implementacji weryfikacji tokenu Clerk.
    // Rozważ użycie `getAuth` z `@clerk/nextjs/server` jeśli to możliwe w tym kontekście.

    // Jeśli używasz JWT bezpośrednio, upewnij się, że masz klucz publiczny Clerka do weryfikacji
    // const JWKS = jose.createRemoteJWKSet(new URL(process.env.CLERK_JWKS_URL!));
    // const { payload } = await jose.jwtVerify(token, JWKS, {
    //   issuer: process.env.CLERK_ISSUER_URL!,
    //   audience: process.env.CLERK_AUDIENCE!,
    // });
    // return payload as ClerkUser; // Rzutowanie na odpowiedni typ

    // Bezpieczniejsza metoda to użycie `getAuth` jeśli jesteśmy w kontekście Next.js API route, 
    // ale to wymaga przekazania obiektu `req` z Next.js, a nie tylko tokenu.
    // Na potrzeby tego endpointu, który może być wywoływany np. przez webhooka Clerka,
    // bezpośrednia weryfikacja JWT może być konieczna.
    // Poniżej uproszczone zwrócenie null - DO ZASTĄPIENIA PRAWDZIWĄ WERYFIKACJĄ
    console.warn("UWAGA: Weryfikacja tokenu JWT od Clerk jest uproszczona i wymaga implementacji!");
    // Przykładowe dane użytkownika, jeśli token byłby poprawny (do symulacji)
    // return {
    //   id: "user_xxxx",
    //   email_addresses: [{ email_address: "test@example.com" }],
    //   first_name: "Test",
    //   last_name: "User"
    // };
    return null; // Właściwa weryfikacja jest potrzebna

  } catch (error) {
    console.error('Błąd weryfikacji tokenu Clerk:', error);
    return null;
  }
}

export async function POST(request: Request) {
  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  let clerkUser: ClerkUser | null;

  // Preferowana metoda: Użyj getAuth jeśli to możliwe
  // Niestety, getAuth(req) wymaga obiektu `req` z NextApiRequest, a tu mamy standardowy Request.
  // Trzeba by dostosować lub znaleźć alternatywę dla weryfikacji w tym kontekście.
  // const { userId, user: fullClerkUser } = getAuth(request as any); // Wymaga rzutowania i może nie działać poprawnie

  // Alternatywna metoda: Weryfikacja samego tokenu JWT (jeśli to jest np. webhook)
  // W tym miejscu zakładamy, że token JWT jest przekazywany i musi być zweryfikowany.
  // To jest bardziej złożone i wymaga obsługi kluczy publicznych Clerk (JWKS).
  // Poniższy kod `verifyClerkToken` jest placeholderem.
  clerkUser = await verifyClerkToken(token);
  
  // Jeśli weryfikacja tokenu nie powiodła się
  if (!clerkUser || !clerkUser.id) {
     // Próba użycia getAuth jako fallback - to jest eksperymentalne
     // W rzeczywistym scenariuszu potrzebujesz jednej, spójnej metody weryfikacji.
    try {
        const { userId: currentUserId, user: fullUserFromClerk } = getAuth(request as any); // To jest ryzykowne rzutowanie
        if (currentUserId && fullUserFromClerk) {
            clerkUser = {
                id: currentUserId,
                email_addresses: fullUserFromClerk.emailAddresses.map(e => ({ email_address: e.emailAddress })),
                first_name: fullUserFromClerk.firstName || undefined,
                last_name: fullUserFromClerk.lastName || undefined,
            }
        } else {
            return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
        }
    } catch (e) {
        console.error("Błąd podczas próby getAuth:", e);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
  }

  if (!clerkUser || !clerkUser.id) {
    return NextResponse.json({ error: 'Unauthorized: Could not verify Clerk user' }, { status: 401 });
  }

  const clerkId = clerkUser.id;
  const email = clerkUser.email_addresses?.[0]?.email_address;
  const firstName = clerkUser.first_name;
  const lastName = clerkUser.last_name;

  if (!email) {
    return NextResponse.json({ error: 'Email not found in Clerk token' }, { status: 400 });
  }

  try {
    // 1. Sprawdź, czy użytkownik istnieje w Payload CMS
    const existingUserResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!existingUserResponse.ok && existingUserResponse.status !== 404) {
        const errorData = await existingUserResponse.text();
        console.error("Błąd odczytu użytkownika z Payload:", existingUserResponse.status, errorData);
        return NextResponse.json({ error: 'Failed to check user in Payload', details: errorData }, { status: existingUserResponse.status });
    }

    const existingUserData = await existingUserResponse.json();

    let payloadUserId: string | null = null;
    let operation: 'create' | 'update' = 'create';

    if (existingUserData && existingUserData.docs && existingUserData.docs.length > 0) {
      payloadUserId = existingUserData.docs[0].id;
      operation = 'update';
    }

    const userDataPayload = {
      clerkId,
      email,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    let syncResponse;
    if (operation === 'create') {
      syncResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users`!, {
        method: 'POST',
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataPayload),
      });
    } else if (payloadUserId) {
      // Aktualizacja istniejącego użytkownika - upewnij się, że wysyłasz tylko te pola, które chcesz zaktualizować
      // Payload domyślnie zastępuje cały dokument, chyba że używasz PATCH z określonymi polami
      // Dla bezpieczeństwa, można wysłać te same dane co przy tworzeniu, Payload zaktualizuje je.
      syncResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users/${payloadUserId}`!, {
        method: 'PATCH', // Użyj PATCH do częściowej aktualizacji, jeśli to preferowane
        headers: {
          'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataPayload), // Wysyłamy pełny zestaw danych, Payload zaktualizuje pola
      });
    } else {
        return NextResponse.json({ error: 'Logic error: operation update but no payloadUserId' }, { status: 500 });
    }

    if (!syncResponse.ok) {
      const errorData = await syncResponse.text();
      console.error("Błąd synchronizacji użytkownika z Payload:", syncResponse.status, errorData);
      return NextResponse.json({ error: 'Failed to sync user with Payload', details: errorData }, { status: syncResponse.status });
    }

    const syncResult = await syncResponse.json();
    return NextResponse.json({ message: `User ${operation === 'create' ? 'created' : 'updated'} successfully in Payload`, data: syncResult }, { status: operation === 'create' ? 201 : 200 });

  } catch (error) {
    console.error('Błąd synchronizacji użytkownika:', error);
    return NextResponse.json({ error: 'Internal server error during user sync' }, { status: 500 });
  }
} 