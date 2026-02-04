"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/Button';
import { Plus, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { EventForm } from '../../../components/admin/EventForm';
import { deleteEvent, publishEvent } from '../../../lib/api';

export default function AdminEventsClient({ initialEvents }: { initialEvents: any[] }) {
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);

    const handleSuccess = () => {
        setIsCreateOpen(false);
        setEditingEvent(null);
        router.refresh(); // Reload data from server
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
                    <p className="text-gray-400">View and manage all upcoming events</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus size={18} /> Create Event
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {initialEvents.map((event: any) => (
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
                            {/* Status Badges */}
                            {event.status === 'PUBLISHED' && (
                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                    Published
                                </span>
                            )}
                            {event.status === 'CANCELED' && (
                                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-500/20">
                                    Canceled
                                </span>
                            )}
                            {(event.status === 'DRAFT' || !event.status) && (
                                <span className="bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-500/20">
                                    Draft
                                </span>
                            )}

                            {/* Publish Action */}
                            {event.status !== 'PUBLISHED' && event.status !== 'CANCELED' && (
                                <Button
                                    variant="outline"
                                    className="text-xs h-8 px-3 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                                    onClick={async () => {
                                        if (confirm('Are you sure you want to publish this event?')) {
                                            await publishEvent(event._id);
                                            router.refresh();
                                        }
                                    }}
                                >
                                    Publish
                                </Button>
                            )}

                            <Link href="#" onClick={(e) => {
                                e.preventDefault();
                                setEditingEvent(event);
                            }}>
                                <Button variant="outline" className="text-sm flex items-center gap-2 h-9">
                                    <Edit2 size={16} /> Edit
                                </Button>
                            </Link>

                            {/* Cancel Action */}
                            {event.status !== 'CANCELED' && (
                                <Button
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 px-3"
                                    onClick={async () => {
                                        if (confirm('Are you sure you want to cancel this event? This cannot be undone.')) {
                                            try {
                                                await deleteEvent(event._id);
                                                router.refresh();
                                            } catch (error) {
                                                alert('Failed to delete/cancel event');
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Event"
            >
                <EventForm
                    onSuccess={handleSuccess}
                    onCancel={() => setIsCreateOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingEvent}
                onClose={() => setEditingEvent(null)}
                title="Edit Event"
            >
                {editingEvent && (
                    <EventForm
                        initialData={editingEvent}
                        isEditing
                        onSuccess={handleSuccess}
                        onCancel={() => setEditingEvent(null)}
                    />
                )}
            </Modal>
        </div>
    );
}
