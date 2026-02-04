import { getAllReservationsServer, getEvents } from '../../../lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Ticket, Calendar, Users, TrendingUp } from 'lucide-react';
import { AdminSidebar } from '../../../components/AdminSidebar';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    // Parallel fetching
    const [reservations, events] = await Promise.all([
        getAllReservationsServer(token),
        getEvents()
    ]);

    // Simple stats
    const totalReservations = reservations.length;
    const totalEvents = events.length;
    const activeEvents = events.filter((e: any) => new Date(e.date) > new Date()).length;
    const confirmedReservations = reservations.filter((r: any) => r.status === 'CONFIRMED').length;

    const stats = [
        { label: 'Total Reservations', value: totalReservations, icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Confirmed Bookings', value: confirmedReservations, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Active Events', value: activeEvents, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    ];

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Admin Overview</h1>
                <p className="text-gray-400">Welcome back, Administrator.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-[#1A2035] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Reservations Preview */}
                <div className="bg-[#1A2035] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Recent Reservations</h2>
                    <div className="space-y-4">
                        {reservations.slice(0, 5).map((res: any) => (
                            <div key={res._id} className="flex items-center justify-between p-4 bg-[#111625] rounded-xl border border-white/5">
                                <div>
                                    <div className="font-bold">{res.eventId?.title || 'Unknown Event'}</div>
                                    <div className="text-xs text-gray-400">{res.userId?.email}</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border ${res.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        res.status === 'CANCELED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                    {res.status}
                                </span>
                            </div>
                        ))}
                        {reservations.length === 0 && <div className="text-gray-500 text-center py-4">No reservations found</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
