// W przyszłości zostaną tu zdefiniowane metody API
// Podstawowa implementacja klienta API

export class ApiClient {
    constructor(private baseUrl: string, private token?: string) { }

    private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    setToken(token: string): void {
        this.token = token;
    }

    clearToken(): void {
        this.token = undefined;
    }

    // Przykładowe metody API - należy je dostosować do rzeczywistych endpointów
    async getPosts<T>(): Promise<T> {
        return this.fetchApi<T>('/api/posts');
    }

    async getPost<T>(id: string): Promise<T> {
        return this.fetchApi<T>(`/api/posts/${id}`);
    }
}

export function createApiClient(baseUrl: string, token?: string): ApiClient {
    return new ApiClient(baseUrl, token);
} 