"use client";

import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#111625] text-white selection:bg-purple-500 selection:text-white">
            <AdminSidebar />
            <div className="pl-64">
                <div className="container mx-auto px-8 py-12">
                    {children}
                </div>
            </div>
        </div>
    );
}
