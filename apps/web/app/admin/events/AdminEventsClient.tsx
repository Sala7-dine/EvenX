"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/Button';
import { Plus, MapPin, Calendar, Edit2, Trash2, ChevronDown } from 'lucide-react';
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

            {/* Events List Header - inspired by "Time Tracker" */}
            <div className="bg-[#050505] rounded-t-2xl border-b border-[#1F1F1F] p-4 flex items-center justify-between text-xs font-semibold text-[#666] uppercase tracking-wider">
                <div className="pl-4">Event Details</div>
                <div className="pr-20">Time & Actions</div>
            </div>

            <div className="flex flex-col bg-[#050505] rounded-b-2xl border border-[#1F1F1F] divide-y divide-[#1F1F1F] overflow-hidden">
                {initialEvents.map((event: any) => (
                    <div key={event._id} className="group flex flex-col md:flex-row items-center justify-between p-4 hover:bg-[#1A2035] transition-colors gap-4">

                        {/* Left Side: Title & Info */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.status === 'PUBLISHED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                event.status === 'CANCELED' ? 'bg-red-500' : 'bg-gray-500'
                                }`} />

                            <div className="flex flex-col">
                                <span className="font-medium text-white text-sm">{event.title}</span>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} className="text-purple-400" />
                                        <span>{event.location}</span>
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <span>{event.capacity} seats</span>
                                </div>
                            </div>

                            {/* Status Pills */}
                            <div className="ml-4">
                                {event.status === 'PUBLISHED' && (
                                    <span className="bg-[#1A2F23] text-green-400 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide border border-green-500/10">
                                        Active
                                    </span>
                                )}
                                {event.status === 'CANCELED' && (
                                    <span className="bg-[#2F1A1A] text-red-400 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide border border-red-500/10">
                                        Canceled
                                    </span>
                                )}
                                {(event.status === 'DRAFT' || !event.status) && (
                                    <span className="bg-[#1E1E2E] text-gray-400 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide border border-gray-500/10">
                                        Draft
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Date & Actions */}
                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-gray-600">-</span>
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Publish Action */}
                                {event.status !== 'PUBLISHED' && event.status !== 'CANCELED' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to publish this event?')) {
                                                await publishEvent(event._id);
                                                router.refresh();
                                            }
                                        }}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors"
                                    >
                                        Publish
                                    </button>
                                )}

                                <button
                                    onClick={() => setEditingEvent(event)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>

                                {event.status !== 'CANCELED' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to cancel?')) {
                                                await deleteEvent(event._id);
                                                router.refresh();
                                            }
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Cancel Event"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
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
