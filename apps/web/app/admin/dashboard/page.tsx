import { getAllReservationsServer, getEvents, Reservation, Event as EventType } from '../../../lib/api';
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
    const activeEvents = events.filter((e: EventType) => new Date(e.date) > new Date()).length;
    const confirmedReservations = reservations.filter((r: Reservation) => r.status === 'CONFIRMED').length;

    const stats = [
        { label: 'Total Reservations', value: totalReservations, icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Confirmed Bookings', value: confirmedReservations, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Active Events', value: activeEvents, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    ];

    return (
        <div className="font-sans text-[#E1E1E1]">
            {/* Header Area */}
            <div className="mb-8">
                <div className="text-sm text-[#666] mb-1">Workspace</div>
                <h1 className="text-2xl font-bold mb-6">Overview</h1>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-[#1F1F1F] mb-8">
                    {['Dashboard', 'Analytics', 'Activity'].map((tab, i) => (
                        <div key={tab} className={`pb-3 text-sm font-medium cursor-pointer relative ${i === 0 ? 'text-white' : 'text-[#666] hover:text-[#999]'}`}>
                            {tab}
                            {i === 0 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-[#111] border border-[#1F1F1F] rounded-xl p-5 hover:border-[#333] transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg.replace('/10', '/20')} text-white`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-[#1C1C1E] border border-[#333] ${stat.color}`}>
                                    +12%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-[#666]">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Reservations Preview */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-[#666]">Recent Activity</div>
                        <div className="text-xs text-[#4E85EB] cursor-pointer hover:underline">View All</div>
                    </div>

                    <div className="bg-[#111] rounded-xl border border-[#1F1F1F] overflow-hidden">
                        {reservations.slice(0, 5).map((res: Reservation, index: number) => (
                            <div key={res._id} className={`flex items-center justify-between p-4 bg-[#111] hover:bg-[#1C1C1E] transition-colors gap-4 ${index !== 4 ? 'border-b border-[#1F1F1F]' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center text-xs font-bold text-purple-200 border border-purple-500/20">
                                        {res.userId?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-[#E1E1E1]">{res.eventId?.title || 'Unknown Event'}</div>
                                        <div className="text-xs text-[#666]">{res.userId?.email}</div>
                                    </div>
                                </div>

                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${res.status === 'CONFIRMED' ? 'bg-[#1A2F23] text-green-400 border-green-900/30' :
                                    res.status === 'CANCELED' ? 'bg-[#2F1A1A] text-red-400 border-red-900/30' :
                                        'bg-[#2C2C2E] text-yellow-400 border-yellow-900/30'
                                    }`}>
                                    {res.status}
                                </span>
                            </div>
                        ))}
                        {reservations.length === 0 && <div className="text-[#666] text-center py-8 text-sm">No reservations found</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
