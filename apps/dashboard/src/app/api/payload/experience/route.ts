import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

interface ExperienceData {
    title: string;
    description?: string;
    // Dodaj inne pola, które chcesz przyjmować, np. tags, date, location etc.
    // tags?: string[]; 
}

export async function POST(request: Request) {
    if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
        return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
    }

    const { userId: clerkId, user: clerkUser } = getAuth(request as any); // Ryzykowne rzutowanie, ale standard w Next.js API routes z Clerk

    if (!clerkId || !clerkUser) {
        return NextResponse.json({ error: 'Unauthorized: User not authenticated' }, { status: 401 });
    }

    let experienceData: ExperienceData;
    try {
        experienceData = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!experienceData.title) {
        return NextResponse.json({ error: 'Title is required for experience' }, { status: 400 });
    }

    try {
        // 1. Znajdź odpowiadającego DashboardUser w Payload na podstawie clerkId
        const findUserResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkId}`, {
            method: 'GET',
            headers: {
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
            },
        });

        if (!findUserResponse.ok) {
            const errorText = await findUserResponse.text();
            console.error('Error fetching dashboard user:', findUserResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to find dashboard user in Payload', details: errorText }, { status: findUserResponse.status });
        }

        const findUserData = await findUserResponse.json();
        if (!findUserData.docs || findUserData.docs.length === 0) {
            return NextResponse.json({ error: 'Dashboard user not found in Payload. Please sync user first.' }, { status: 404 });
        }
        const payloadDashboardUserId = findUserData.docs[0].id;

        // 2. Przygotuj dane do utworzenia Experience
        const payloadExperienceData = {
            ...experienceData, // title, description, etc.
            owner: payloadDashboardUserId, // Ustawienie relacji do dashboard-users
        };

        // 3. Utwórz Experience w Payload CMS
        const createExperienceResponse = await fetch(`${PAYLOAD_API_URL}/api/experiences`, {
            method: 'POST',
            headers: {
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadExperienceData),
        });

        if (!createExperienceResponse.ok) {
            const errorText = await createExperienceResponse.text();
            console.error('Error creating experience in Payload:', createExperienceResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to create experience in Payload', details: errorText }, { status: createExperienceResponse.status });
        }

        const createdExperience = await createExperienceResponse.json();

        return NextResponse.json({ message: 'Experience created successfully', data: createdExperience.doc || createdExperience }, { status: 201 });

    } catch (error) {
        console.error('Error creating experience:', error);
        return NextResponse.json({ error: 'Internal server error while creating experience' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
        return NextResponse.json({ error: 'Payload API URL or Key not configured' }, { status: 500 });
    }

    const { userId: clerkIdFromAuth } = getAuth(request as any);

    if (!clerkIdFromAuth) {
        return NextResponse.json({ error: 'Unauthorized: User not authenticated via Clerk' }, { status: 401 });
    }

    try {
        const findUserResponse = await fetch(`${PAYLOAD_API_URL}/api/dashboard-users?where[clerkId][equals]=${clerkIdFromAuth}`, {
            method: 'GET',
            headers: {
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
            },
        });

        if (!findUserResponse.ok) {
            const errorText = await findUserResponse.text();
            console.error('Error fetching dashboard user for experience retrieval:', findUserResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to find dashboard user in Payload', details: errorText }, { status: findUserResponse.status });
        }

        const findUserData = await findUserResponse.json();
        if (!findUserData.docs || findUserData.docs.length === 0) {
            return NextResponse.json({ error: 'Dashboard user not found in Payload. Cannot retrieve experiences.' }, { status: 404 });
        }
        const payloadDashboardUserId = findUserData.docs[0].id;

        const fetchExperiencesResponse = await fetch(`${PAYLOAD_API_URL}/api/experiences?where[owner][equals]=${payloadDashboardUserId}&depth=1`, {
            method: 'GET',
            headers: {
                'Authorization': `users API-Key ${PAYLOAD_API_KEY}`,
            },
        });

        if (!fetchExperiencesResponse.ok) {
            const errorText = await fetchExperiencesResponse.text();
            console.error('Error fetching experiences from Payload:', fetchExperiencesResponse.status, errorText);
            return NextResponse.json({ error: 'Failed to fetch experiences from Payload', details: errorText }, { status: fetchExperiencesResponse.status });
        }

        const experiencesData = await fetchExperiencesResponse.json();

        return NextResponse.json({ data: experiencesData.docs || [] }, { status: 200 });

    } catch (error) {
        console.error('Error retrieving experiences:', error);
        return NextResponse.json({ error: 'Internal server error while retrieving experiences' }, { status: 500 });
    }
} 