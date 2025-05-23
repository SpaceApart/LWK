const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001/api'

export interface PayloadPage {
    id: string
    title: string
    content?: any
    slug: string
    meta?: {
        title?: string
        description?: string
    }
    publishedAt?: string
    createdAt: string
    updatedAt: string
}

export interface PayloadResponse<T> {
    docs: T[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage?: number
    nextPage?: number
}

export async function fetchPages(): Promise<PayloadResponse<PayloadPage>> {
    try {
        const response = await fetch(`${PAYLOAD_API_URL}/pages?limit=10&sort=-createdAt`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }, // Revalidate every minute
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching pages:', error)
        throw error
    }
}

export async function fetchPageBySlug(slug: string): Promise<PayloadPage | null> {
    try {
        const response = await fetch(`${PAYLOAD_API_URL}/pages?where[slug][equals]=${slug}&limit=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: PayloadResponse<PayloadPage> = await response.json()
        return data.docs[0] || null
    } catch (error) {
        console.error('Error fetching page by slug:', error)
        return null
    }
}

export async function fetchPosts(): Promise<PayloadResponse<any>> {
    try {
        const response = await fetch(`${PAYLOAD_API_URL}/posts?limit=10&sort=-createdAt`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching posts:', error)
        throw error
    }
} 