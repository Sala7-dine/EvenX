import { getEvents } from '../../../lib/api';
import Link from 'next/link';
import { Button } from '../../../components/Button';
import { Plus, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
                    <p className="text-gray-400">View and manage all upcoming events</p>
                </div>
                <Link href="/admin/events/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus size={18} /> Create Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {events.map((event: any) => (
                    <div key={event._id} className="bg-[#1A2035] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-500/30 transition-all">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-purple-400" />
                                    <span>{new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-purple-400" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-xs">Capacity: {event.capacity}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/admin/events/${event._id}/edit`}>
                                <Button variant="outline" className="text-sm flex items-center gap-2">
                                    <Edit2 size={16} /> Edit
                                </Button>
                            </Link>
                            {/* <DeleteEventButton id={event._id} /> - To be implemented if deletion logic is complex, or inline form */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
