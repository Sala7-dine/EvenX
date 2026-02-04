import { Navbar } from "../../../components/Navbar";
import { Button } from "../../../components/Button";
import { getEvent } from "../../../lib/api";
import { Calendar, MapPin, Users, Ticket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return (
            <div className="min-h-screen bg-navy-900 text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                <Link href="/" className="text-purple-400 hover:text-white underline">Return Home</Link>
            </div>
        );
    }

    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <main className="min-h-screen bg-navy-900 text-white selection:bg-purple-500 selection:text-white pb-20">
            <Navbar />

            {/* Header / Hero for Detail */}
            <div className="relative pt-32 pb-20 px-6 hero-glow-bg">
                <div className="container mx-auto">
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Events
                    </Link>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">{event.title}</h1>

                    <div className="flex flex-wrap gap-6 text-gray-300 font-medium">
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                            <Calendar size={18} className="text-purple-400" />
                            <span>{formattedDate} • {formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                            <MapPin size={18} className="text-purple-400" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description Card */}
                    <div className="bg-[#111625] p-8 rounded-2xl border border-white/5">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                            About the Event
                        </h2>
                        <div className="prose prose-invert prose-lg text-gray-300">
                            <p>{event.description}</p>
                            {/* Placeholder for more content since API desc is short */}
                            <p className="mt-4">
                                Join us for an immersive experience designed to bring together the brightest minds.
                                Whether you are looking to network, learn new skills, or get inspired, this event will provide actionable insights
                                and meaningful connections.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Ticket Card */}
                <div className="lg:col-span-1 relative z-10">
                    <div className="sticky top-24 bg-[#111625] p-8 rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/10">
                        <h3 className="text-xl font-bold mb-6">Reserve Your Spot</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Users size={18} />
                                    <span>Capacity</span>
                                </div>
                                <span className="font-bold text-white">{event.capacity} Seats</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Ticket size={18} />
                                    <span>Price</span>
                                </div>
                                <span className="font-bold text-green-400">Free</span>
                            </div>
                        </div>

                        <Button className="w-full py-4 text-base tracking-widest uppercase shadow-lg shadow-purple-600/25">
                            Register Now
                        </Button>
                        <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by EvenX</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
