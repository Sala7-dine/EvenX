import Image from 'next/image';
import { Button } from './Button';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Hero = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center pt-20 overflow-hidden hero-glow-bg">
            {/* Background Decorative Circles/Lines would go here */}

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content (Image Placeholders for Speaker) */}
                <div className="relative">
                    {/* Speaker Image from Unsplash */}
                    <div className="w-[400px] h-[500px] rounded-lg relative overflow-hidden ml-10">
                        <Image
                            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80"
                            alt="Conference Speaker"
                            fill
                            className="object-cover grayscale opacity-80"
                            priority
                        />
                        {/* Content Overlay */}
                        <div className="absolute bottom-10 left-6 text-white z-20">
                            <p className="text-xs font-bold tracking-widest text-gray-400 mb-2">9 JUNE 2023 <span className="mx-2">|</span> LIMITED SEAT</p>
                            <h2 className="text-3xl font-bold leading-tight mb-6">Get Inside in The<br />Philosopher&apos;s Mind</h2>
                            <Button variant="outline" className="text-xs uppercase tracking-widest px-8 py-3 rounded-full border-gray-600 hover:bg-white hover:text-black hover:border-white transition-colors">
                                Buy Tickets
                            </Button>
                        </div>
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="text-white relative">
                    {/* Main Heading */}
                    <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                        The Ultimate Platform
                    </h1>

                    {/* Description */}
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-12">
                        Eventify is a leading event and conference website that brings together industry experts, thought leaders, and enthusiasts from around the world to share knowledge, network, and make lasting connections.
                    </p>

                    {/* See More Link */}
                    <div className="flex items-center gap-2 text-sm font-bold tracking-wide mb-24 cursor-pointer hover:text-purple-400 transition-colors">
                        See more about us <span className="text-lg">↓</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-6 mt-12 justify-end text-gray-400">
                        <Facebook size={20} className="hover:text-white cursor-pointer" />
                        <Twitter size={20} className="hover:text-white cursor-pointer" />
                        <Linkedin size={20} className="hover:text-white cursor-pointer" />
                        <Instagram size={20} className="hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Decorative Background Element (Bottom Right Curve) */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[url('/bg-curve.svg')] bg-no-repeat bg-contain opacity-20 pointer-events-none mix-blend-screen"></div>
        </div>
    );
};
