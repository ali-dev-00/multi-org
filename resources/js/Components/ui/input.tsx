import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => {
		return <input ref={ref} className={cn('border border-black px-3 py-2 text-sm w-full', className)} {...props} />
	},
)
Input.displayName = 'Input'


