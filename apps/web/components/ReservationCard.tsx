"use client";

import Link from 'next/link';
import { Calendar, MapPin, X, Ticket } from 'lucide-react';
import { Button } from './Button';

interface ReservationProps {
    reservation: {
        _id: string;
        // Support both field names (backend uses eventId, legacy might use event)
        event?: {
            title: string;
            date: string;
            location: string;
            _id: string;
        };
        eventId?: {
            title: string;
            date: string;
            location: string;
            _id: string;
        };
        status: string;
        createdAt: string;
    };
    onCancel: (id: string) => void;
    cancellingId: string | null;
}

export const ReservationCard = ({ reservation, onCancel, cancellingId }: ReservationProps) => {
    const isCancelling = cancellingId === reservation._id;
    // Resolve the event object
    const event = reservation.eventId || reservation.event;

    if (!event) return null; // Should not happen if data is valid

    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-[#111625] border border-white/5 rounded-2xl p-6 group hover:border-purple-500/30 transition-all shadow-lg hover:shadow-purple-900/100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <Link href={`/events/${event._id}`}>
                            <h3 className="text-lg font-bold text-white hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                        </Link>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${reservation.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            reservation.status === 'CANCELED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                            {reservation.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span suppressHydrationWarning>{formattedDate} • {formattedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="truncate">{event.location}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {reservation.status !== 'CANCELED' && (
                    <Button
                        onClick={() => onCancel(reservation._id)}
                        disabled={isCancelling}
                        variant="outline"
                        className="flex-1 text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        {isCancelling ? 'Cancelling...' : 'Cancel'}
                    </Button>
                )}
                <Link href={`/events/${event._id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs">
                        View Event
                    </Button>
                </Link>
            </div>
        </div>
    );

};
