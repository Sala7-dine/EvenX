"use client";

import { X } from 'lucide-react';
import { Button } from './Button';
import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[#1F1F1F] sticky top-0 bg-[#050505]/95 backdrop-blur z-10">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <Button variant="ghost" onClick={onClose} className="p-2 h-auto text-gray-400 hover:text-white">
                        <X size={20} />
                    </Button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
