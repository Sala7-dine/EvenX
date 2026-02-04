"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { createReservation } from '../lib/api';
import { Loader2 } from 'lucide-react';

interface EventBookingButtonProps {
    eventId: string;
    isBooked?: boolean;
}

export const EventBookingButton = ({ eventId, isBooked = false }: EventBookingButtonProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>(isBooked ? 'success' : 'idle');
    const [message, setMessage] = useState(isBooked ? 'You have already booked this event' : '');

    const handleBooking = async () => {
        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await createReservation(eventId);
            setStatus('success');
            setMessage('Reservation confirmed!');
            // Optional: Redirect to dashboard after delay
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (error: any) {
            console.error(error);
            // Handle "Already Booked" as a state update rather than an error
            if (error.message === 'You have already booked this event') {
                setStatus('success');
                setMessage('You have already booked this event');
                return;
            }

            setStatus('error');
            if (error.message === 'Not authenticated' || error.message === 'Unauthorized') {
                router.push('/login');
            } else {
                setMessage(error.message || 'Failed to book event');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Show message only if it's a new confirmation, not for pre-existing booking */}
            {(status === 'success' && !isBooked && message !== 'You have already booked this event') && (
                <div className="p-3 bg-green-500/20 text-green-400 text-sm rounded-lg text-center font-medium border border-green-500/20">
                    {message}
                </div>
            )}
            {/* ... error message ... */}
            {status === 'error' && (
                <div className="p-3 bg-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium border border-red-500/20">
                    {message}
                </div>
            )}

            <Button
                onClick={handleBooking}
                disabled={loading || status === 'success' || isBooked}
                className={`w-full py-4 text-base tracking-widest uppercase shadow-lg shadow-purple-600/25 ${status === 'success' || isBooked ? 'bg-green-600 hover:bg-green-700 disabled:opacity-100' : ''}`}
            >
                {loading ? <Loader2 className="animate-spin" /> : status === 'success' || isBooked ? 'Already Booked' : 'Register Now'}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by EvenX</p>
        </div>
    );
};
