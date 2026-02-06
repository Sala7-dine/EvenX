import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { ReservationList } from '../../../components/ReservationList';
import { getMyReservationsServer } from '../../../lib/api';
import Link from 'next/link';
import { Button } from '../../../components/Button';
import { ArrowLeft } from 'lucide-react';

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
                        <p className="text-gray-400">Manage your upcoming events and reservations</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft size={16} /> Return to Home
                        </Button>
                    </Link>
                </div>

                <ReservationList initialReservations={reservations} />
            </div>
        </main>
    );
}
