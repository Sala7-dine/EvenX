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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Manage Reservations</h1>
                <p className="text-gray-400">View and update reservation status</p>
            </div>

            <AdminReservationTable initialReservations={reservations} />
        </div>
    );
}
