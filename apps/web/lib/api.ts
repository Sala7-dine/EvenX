export const API_URL = 'http://127.0.0.1:3000'; // Adjust if different port

export async function getEvents() {
    try {
        const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch events');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getEvent(id: string) {
    try {
        const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password?: string;
}

export async function login(credentials: LoginCredentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Login failed');
    }
    return res.json();
}

export async function register(data: RegisterData) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(error.message || 'Registration failed');
    }
    return res.json();
}
