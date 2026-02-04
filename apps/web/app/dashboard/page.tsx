import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { ReservationList } from '../../components/ReservationList';
import { getMyReservationsServer } from '../../lib/api';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const reservations = await getMyReservationsServer(token);

    return (
        <main className="min-h-screen bg-[#0B1121] text-white selection:bg-purple-500 selection:text-white pb-20">
            <Navbar />

            <div className="container mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
                    <p className="text-gray-400">Manage your upcoming events and reservations</p>
                </div>

                <ReservationList initialReservations={reservations} />
            </div>
        </main>
    );
}
