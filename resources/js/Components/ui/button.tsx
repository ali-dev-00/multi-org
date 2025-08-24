import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }

export function Button({ className, variant = 'default', ...props }: Props) {
	const base = 'inline-flex items-center justify-center whitespace-nowrap text-sm px-3 py-2 border'
	const variants = {
		default: 'bg-black text-white border-black hover:opacity-90',
		outline: 'bg-white text-black border-black hover:bg-gray-50',
	}
	return <button className={cn(base, variants[variant], className)} {...props} />
}


