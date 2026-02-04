import Cookies from 'js-cookie';

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

export async function logout() {
    const token = Cookies.get('token');
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return res.status === 200 || res.status === 201;
}

export async function createReservation(eventId: string) {
    const token = Cookies.get('token');

    // Debug logging
    console.log('Reservation Token:', token ? token.substring(0, 10) + '...' : 'NONE');

    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId }),
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Not authenticated'); // Unify error message for client to handle redirect
        }
        const error = await res.json().catch(() => ({ message: 'Failed to reserve' }));
        throw new Error(error.message || 'Failed to reserve');
    }
    return res.json();
}

export async function getMyReservations() {
    const token = Cookies.get('token');
    if (!token) return [];

    const res = await fetch(`${API_URL}/reservations/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) return [];
    return res.json();
}

export async function cancelReservation(reservationId: string) {
    // ... existing logic
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to cancel' }));
        throw new Error(error.message || 'Failed to cancel');
    }
    return res.json();
}

// Server-side function (cannot be called from client directly without Server Actions, but we use it in Server Components)
export async function getMyReservationsServer(token: string) {
    if (!token) return [];

    const res = await fetch(`${API_URL}/reservations/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) return [];
    return res.json();
}

export async function getTicket(reservationId: string) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/reservations/${reservationId}/ticket`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to download ticket' }));
        throw new Error(error.message || 'Failed to download ticket');
    }
    return res.blob();
}
