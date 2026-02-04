import Link from 'next/link';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
}

export const EventCard = ({ event }: { event: Event }) => {
    // Format date nicely
    const dateObj = new Date(event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();

    return (
        <Link href={`/events/${event._id}`} className="group block">
            <div className="bg-[#111625] rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-purple-600/50">
                <div className="h-48 bg-gray-800 relative bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-3 text-center min-w-[60px] border border-white/20">
                        <span className="block text-xl font-bold text-white leading-none">{day}</span>
                        <span className="block text-xs font-bold text-purple-400 mt-1">{month}</span>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium tracking-wide">
                        <span>{event.location}</span>
                        <span className="uppercase">{year}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
