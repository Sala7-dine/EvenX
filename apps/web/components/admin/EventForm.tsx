"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button';
import { Loader2, Calendar, MapPin, Type, FileText, Users } from 'lucide-react';
import { createEvent, updateEvent } from '../../lib/api';

interface EventFormProps {
    initialData?: {
        _id?: string;
        title: string;
        description: string;
        date: string;
        location: string;
        capacity: number;
    };
    isEditing?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const EventForm = ({ initialData, isEditing = false, onSuccess, onCancel }: EventFormProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        date: formatDateForInput(initialData?.date),
        location: initialData?.location || '',
        capacity: initialData?.capacity || 100,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                date: new Date(formData.date).toISOString()
            };

            if (isEditing && initialData?._id) {
                await updateEvent(initialData._id, payload);
            } else {
                await createEvent(payload);
            }
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/admin/events');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-[#1A2035] p-8 rounded-2xl border border-white/5">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Event Title</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Type className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Summer Music Festival"
                            className="w-full bg-[#111625] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Description</label>
                    <div className="relative group">
                        <div className="absolute top-3 left-4 pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <textarea
                            placeholder="Describe your event..."
                            rows={4}
                            className="w-full bg-[#111625] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Date & Time</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="datetime-local"
                                className="w-full bg-[#111625] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Capacity</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                placeholder="100"
                                className="w-full bg-[#111625] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Location</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Grand Hall, New York"
                            className="w-full bg-[#111625] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel ? onCancel : () => router.back()}
                    disabled={loading}
                    className="text-gray-400 hover:text-white"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : (isEditing ? 'Update Event' : 'Create Event')}
                </Button>
            </div>
        </form>
    );
};
