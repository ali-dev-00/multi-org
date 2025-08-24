import { PropsWithChildren, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return <div className={cn("border border-gray-300 rounded-lg bg-white", className)} {...props}>{children}</div>
}

export function CardHeader({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return <div className={cn("border-b border-gray-300 rounded-lg px-4 py-2 font-semibold", className)} {...props}>{children}</div>
}

export function CardContent({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return <div className={cn("p-4", className)} {...props}>{children}</div>
}

export function CardTitle({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
	return <h3 className={cn("text-lg font-semibold", className)} {...props}>{children}</h3>
}


