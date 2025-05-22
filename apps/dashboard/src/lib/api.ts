import { createApiClient } from '@lwk/api-client';

// Pobierz URL API z zmiennych środowiskowych
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Utwórz instancję klienta API
export const api = createApiClient(API_URL);

// Funkcja do ustawiania tokenu uwierzytelniającego
export const setAuthToken = (token: string | undefined) => {
    if (token) {
        api.setToken(token);
    } else {
        api.clearToken();
    }
}; 