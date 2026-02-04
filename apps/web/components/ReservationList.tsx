"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationCard } from './ReservationCard';
import { cancelReservation } from '../lib/api';
import { Ticket } from 'lucide-react';

interface ReservationListProps {
    initialReservations: any[];
}

export const ReservationList = ({ initialReservations }: ReservationListProps) => {
    const router = useRouter();
    const [reservations, setReservations] = useState(initialReservations);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        setCancellingId(id);
        try {
            await cancelReservation(id);
            setReservations(prev => prev.map(r =>
                r._id === id ? { ...r, status: 'CANCELED' } : r
            ));
            router.refresh(); // Refresh server data logic if needed
        } catch (error) {
            console.error("Failed to cancel", error);
            alert('Failed to cancel reservation');
        } finally {
            setCancellingId(null);
        }
    };

    if (reservations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-2xl bg-[#111625]/50">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Ticket className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Reservations Yet</h2>
                <p className="text-gray-400 mb-8 text-center max-w-sm">You haven't booked any events yet. Explore our events and reserve your spot today!</p>
                <button onClick={() => router.push('/')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                    Browse Events
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
                <ReservationCard
                    key={reservation._id}
                    reservation={reservation}
                    onCancel={handleCancel}
                    cancellingId={cancellingId}
                />
            ))}
        </div>
    );
};
