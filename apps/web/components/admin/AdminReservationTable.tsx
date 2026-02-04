"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmReservation, cancelReservation } from '../../lib/api';
import { Button } from '../Button';
import { Ticket, X, Check, Loader2 } from 'lucide-react';

interface Reservation {
    _id: string;
    eventId: {
        title: string;
        date: string;
    } | null;
    userId: {
        email: string;
        name: string;
    } | null;
    status: string;
    createdAt: string;
}

export const AdminReservationTable = ({ initialReservations }: { initialReservations: Reservation[] }) => {
    const router = useRouter();
    const [reservations, setReservations] = useState(initialReservations);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleConfirm = async (id: string) => {
        setProcessing(id);
        try {
            await confirmReservation(id);
            // Optimistic update
            setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'CONFIRMED' } : r));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to confirm reservation');
        } finally {
            setProcessing(null);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;
        setProcessing(id);
        try {
            await cancelReservation(id);
            setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'CANCELED' } : r));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to cancel reservation');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="bg-transparent border border-[#1F1F1F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#111] text-[#666] uppercase font-semibold text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Participant</th>
                            <th className="px-6 py-4">Date Booked</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {reservations.map((reservation) => (
                            <tr key={reservation._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">
                                    {reservation.eventId?.title || 'Unknown Event'}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    <div className="font-medium text-white">{reservation.userId?.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{reservation.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {new Date(reservation.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full border ${reservation.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        reservation.status === 'CANCELED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {reservation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {reservation.status === 'PENDING' && (
                                        <Button
                                            onClick={() => handleConfirm(reservation._id)}
                                            disabled={processing === reservation._id}
                                            className="text-xs bg-green-600/20 text-green-400 hover:bg-green-600/30 border-0 p-2 h-8 w-8 rounded-full"
                                            title="Confirm"
                                        >
                                            {processing === reservation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                                        </Button>
                                    )}
                                    {reservation.status !== 'CANCELED' && (
                                        <Button
                                            onClick={() => handleCancel(reservation._id)}
                                            disabled={processing === reservation._id}
                                            className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 border-0 p-2 h-8 w-8 rounded-full"
                                            title="Cancel"
                                        >
                                            {processing === reservation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X size={16} />}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {reservations.length === 0 && <div className="p-8 text-center text-gray-500">No reservations found.</div>}
        </div>
    );
};
