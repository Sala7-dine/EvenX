"use client";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { EventCard } from "../components/EventCard";
import { useEffect, useState } from "react";
import { getEvents } from "../lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-navy-900 text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      <Hero />

      {/* Events List Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold border-l-4 border-purple-600 pl-4">Upcoming Events</h2>
            <p className="text-gray-400 mt-2 ml-5">Explore the latest conferences and workshops</p>
          </div>
          {/* Filter/View All Button could go here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p className="text-lg">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
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
