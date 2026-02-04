"use client";


import { EventForm } from '../../../../components/admin/EventForm';


export default function CreateEventPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
                <p className="text-gray-400">Fill in the details to publish a new event</p>
            </div>

            <EventForm />
        </div>
    );
}
