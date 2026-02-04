"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react';
import { register } from '../../lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData);
            // Determine role from backend response or default, assuming participant for now.
            // Redirect to login or auto-login
            router.push('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0B1121] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden">

            <div className="flex min-h-screen">
                {/* Left Side - Brand & Message */}
                <div className="hidden lg:flex w-1/2 relative items-center justify-center p-16 overflow-hidden bg-[#0B1121]">
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                    <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 max-w-xl">
                        <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
                                <span className="text-xl font-bold text-white">E</span>
                            </div>
                            <span className="text-2xl font-bold tracking-wide text-white">EVENTIFY</span>
                        </Link>

                        <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
                            Join our community <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Of Amazing Learners</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Create your account to start your journey, connect with others, and attend exclusive events.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#111625] relative">
                    <div className="w-full max-w-md space-y-8">
                        <div className="lg:hidden mb-8">
                            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium mb-8">
                                <ArrowLeft size={16} className="mr-2" /> Back to Home
                            </Link>
                            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-gray-400">Join us for unforgettable events</p>
                        </div>

                        <div className="hidden lg:block mb-8">
                            <div className="flex justify-between items-center mb-8">
                                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium group">
                                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-gray-400 text-sm">Fill in your details to get started</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-[#0B1121] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-[#0B1121] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#0B1121] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
                                    <input type="checkbox" className="rounded border-gray-600 bg-[#0B1121] text-purple-600 focus:ring-purple-500/50" required />
                                    <span>I agree to the <a href="#" className="underline hover:text-purple-400">Terms & Conditions</a></span>
                                </label>
                            </div>

                            <Button disabled={loading} className="w-full py-4 text-sm font-bold tracking-widest uppercase shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign Up ->'}
                            </Button>
                        </form>

                        <div className="pt-8 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-all ml-1">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
