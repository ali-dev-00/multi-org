import { PropsWithChildren } from 'react'

export function Table({ children }: PropsWithChildren) {
	return <table className="w-full border border-black border-collapse text-sm">{children}</table>
}
export function THead({ children }: PropsWithChildren) {
	return <thead className="bg-gray-50">{children}</thead>
}
export function TR({ children }: PropsWithChildren) {
	return <tr className="border-b border-black">{children}</tr>
}
export function TH({ children }: PropsWithChildren) {
	return <th className="text-left p-2">{children}</th>
}
export function TD({ children }: PropsWithChildren) {
	return <td className="p-2 align-top">{children}</td>
}


