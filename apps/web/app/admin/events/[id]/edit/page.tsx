"use client";

import { useEffect, useState } from 'react';
import { EventForm } from '../../../../../components/admin/EventForm';
import { getEvent } from '../../../../../lib/api';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditEventPage() {
    const params = useParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (params.id) {
                const data = await getEvent(params.id as string);
                setEvent(data);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
            </div>
        );
    }

    if (!event) {
        return <div className="text-center text-red-400 mt-12">Event not found</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
                <p className="text-gray-400">Update event details</p>
            </div>

            <EventForm initialData={event} isEditing />
        </div>
    );
}
