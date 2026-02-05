import Cookies from 'js-cookie';

export const API_URL = typeof window === 'undefined'
    ? (process.env.API_URL || 'http://api:3000')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

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

export async function getAdminEvents() {
    const token = Cookies.get('token');
    // If running on server, we might need a different way to get token, 
    // but for now this is called from Client Component useEffect or passed from Server Component.
    // Actually, AdminEventsPage is Server Component, so we need a server-side version expecting token.
    return [];
}

export async function getAdminEventsServer(token: string) {
    if (!token) return [];

    const res = await fetch(`${API_URL}/events/admin`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) return [];
    return res.json();
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

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PARTICIPANT';
}

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizer: string;
    category: string;
    imageUrl?: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    isPublished?: boolean;
}

export interface Reservation {
    _id: string;
    userId: User;
    eventId: Event;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    tickedId?: string;
    createdAt: string;
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

// Admin API Functions

export async function getAllReservations() {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/reservations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch reservations');
    }
    return res.json();
}

export async function confirmReservation(id: string) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/reservations/${id}/confirm`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error('Failed to confirm reservation');
    }
    return res.json();
}

export async function getAllReservationsServer(token: string) {
    if (!token) return [];

    const res = await fetch(`${API_URL}/reservations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) return [];
    return res.json();
}

export async function createEvent(data: any) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to create event' }));
        throw new Error(error.message || 'Failed to create event');
    }
    return res.json();
}

export async function updateEvent(id: string, data: any) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to update event' }));
        throw new Error(error.message || 'Failed to update event');
    }
    return res.json();
}

export async function deleteEvent(id: string) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to delete event' }));
        throw new Error(error.message || 'Failed to delete event');
    }
    return res.json();
}

export async function publishEvent(id: string) {
    const token = Cookies.get('token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/events/${id}/publish`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to publish event' }));
        throw new Error(error.message || 'Failed to publish event');
    }
    return res.json();
}
