import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const baseStyles = "px-6 py-2 rounded-full font-medium transition-all duration-300";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90",
        outline: "border border-gray-500 text-white hover:border-white hover:bg-white/10",
        ghost: "text-gray-400 hover:text-white"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
