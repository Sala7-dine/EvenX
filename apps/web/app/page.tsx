import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { EventCard } from "../components/EventCard";
import { getEvents } from "../lib/api";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role === 'ADMIN') {
        redirect('/admin/dashboard');
      }
    } catch (error) {
      // Invalid token, ignore
    }
  }

  const events: Event[] = await getEvents();

  return (
    <main className="min-h-screen bg-[#0B1121] text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      <Hero />

      {/* Events List Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold border-l-4 border-purple-600 pl-4">Upcoming Events</h2>
            <p className="text-gray-400 mt-2 ml-5">Explore the latest conferences and workshops</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 bg-[#111625] rounded-lg border border-white/5">
              <p className="text-lg">No events scheduled at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
