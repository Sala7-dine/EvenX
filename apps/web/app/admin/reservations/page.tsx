import { getAllReservationsServer } from '../../../lib/api';
import { AdminReservationTable } from '../../../components/admin/AdminReservationTable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminReservationsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const reservations = await getAllReservationsServer(token);

    return (
        <div>
            <AdminReservationTable initialReservations={reservations} />
        </div>
    );
}
