import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import SecondaryButton from '@/Components/SecondaryButton'
import PrimaryButton from '@/Components/PrimaryButton'

interface Contact {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    notes?: { id: number; body: string; user_id: number; created_at: string; updated_at: string; user: { name: string } }[]
    avatar_path?: string
    meta?: { id: number; key: string; value: string }[]
}

interface EditContactModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contact: Contact | null
}

export default function EditContactModal({ open, onOpenChange, contact }: EditContactModalProps) {
    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        notes: '',
        meta: [] as { key: string; value: string }[],
        avatar: null as File | null,
    })

    useEffect(() => {
        if (contact) {
            form.setData({
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                notes: contact.notes?.map(note => note.body).join('\n') || '',
                meta: contact.meta?.map(m => ({ key: m.key, value: m.value })) || [],
                avatar: null,
            })
        }
    }, [contact])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (contact) {
            form.patch(route('contacts.update', contact.id), {
                forceFormData: true,
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                },
            })
        }
    }

    const addMetaField = () => {
        if (form.data.meta.length < 5) {
            form.setData('meta', [...form.data.meta, { key: '', value: '' }])
        }
    }

    const removeMetaField = (index: number) => {
        const newMeta = form.data.meta.filter((_, i) => i !== index)
        form.setData('meta', newMeta)
    }

    const updateMetaField = (index: number, field: 'key' | 'value', value: string) => {
        const newMeta = [...form.data.meta]
        newMeta[index] = { ...newMeta[index], [field]: value }
        form.setData('meta', newMeta)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Contact</DialogTitle>
                    <DialogDescription>
                        Update contact information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                    <div>
                            <Label htmlFor="edit_avatar">Avatar</Label>
                            <div className="mt-2 flex items-center gap-4">
                                {form.data.avatar ? (
                                    <img
                                        src={URL.createObjectURL(form.data.avatar)}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-full object-cover border"
                                    />
                                ) : contact?.avatar_path ? (
                                    <img
                                        src={`/storage/${contact.avatar_path}`}
                                        alt="Current Avatar"
                                        className="h-16 w-16 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 font-semibold">
                                        {contact?.first_name?.charAt(0)}
                                        {contact?.last_name?.charAt(0)}
                                    </div>
                                )}
                                <Input
                                    id="edit_avatar"
                                    type="file"
                                    accept="image/*"
                                    className="border-gray-300 rounded-md"
                                    onChange={(e) =>
                                        form.setData('avatar', e.target.files ? e.target.files[0] : null)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_first_name">First Name</Label>
                                <Input
                                    id="edit_first_name"
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                    required
                                    className="mt-2 border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_last_name">Last Name</Label>
                                <Input
                                    id="edit_last_name"
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                    required
                                    className="mt-2 border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit_email">Email</Label>
                            <Input
                                id="edit_email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                                className="mt-2 border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_phone">Phone</Label>
                            <Input
                                id="edit_phone"
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                className="mt-2 border-gray-300 rounded-md"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="edit_notes">Notes</Label>
                            <Textarea
                                id="edit_notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Add any notes about this contact..."
                                className="mt-2 border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Custom Fields</Label>
                            {form.data.meta.map((field, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="Field Key"
                                        value={field.key}
                                        onChange={(e) => updateMetaField(index, 'key', e.target.value)}
                                        className="col-span-1 mt-2 border-gray-300 rounded-md"
                                    />
                                    <Input
                                        placeholder="Field Value"
                                        value={field.value}
                                        onChange={(e) => updateMetaField(index, 'value', e.target.value)}
                                        className="col-span-1 mt-2 border-gray-300 rounded-md"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => removeMetaField(index)}
                                        className="col-span-2 text-sm py-1 mt-2 border-gray-300 rounded-md"
                                    >
                                        Remove Field
                                    </Button>
                                </div>
                            ))}
                            <SecondaryButton 
                                variant="default"  
                                onClick={addMetaField} 
                                className="col-span-2 flex justify-center text-sm py-1"
                            >
                                Add Custom Field
                            </SecondaryButton>
                        </div>
                    </div>
                    <DialogFooter>
                        <SecondaryButton 
                            type="button" 
                            variant="default" 
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
