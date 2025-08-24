import { ButtonHTMLAttributes } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'destructive'
}

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    size = 'md',
    variant = 'default',
    ...props
}: SecondaryButtonProps) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${
                    size === 'sm' ? 'px-2 py-1 text-xs' : 
                    size === 'lg' ? 'px-6 py-3 text-base' : 
                    'px-4 py-2 text-sm'
                } ${
                    variant === 'destructive' ? 
                    'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' : 
                    'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
