import { getAdminEventsServer } from '../../../lib/api';
import AdminEventsClient from './AdminEventsClient';
import { cookies } from 'next/headers';

export default async function EventsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || '';
    const events = await getAdminEventsServer(token);

    return <AdminEventsClient initialEvents={events} />;
}
