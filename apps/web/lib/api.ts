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
