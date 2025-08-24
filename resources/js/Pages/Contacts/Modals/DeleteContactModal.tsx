import { useForm } from '@inertiajs/react'
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import SecondaryButton from '@/Components/SecondaryButton'

interface Contact {
    id: number
    first_name: string
    last_name: string
}

interface DeleteContactModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contact: Contact | null
}

export default function DeleteContactModal({ open, onOpenChange, contact }: DeleteContactModalProps) {
    const form = useForm({})

    const handleDelete = () => {
        if (contact) {
            form.delete(route('contacts.destroy', contact.id), {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Contact</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{' '}
                        <strong>{contact?.first_name} {contact?.last_name}</strong>? 
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <SecondaryButton 
                        variant="default" 
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </SecondaryButton>
                    <SecondaryButton 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={form.processing}
                    >
                        {form.processing ? 'Deleting...' : 'Delete Contact'}
                    </SecondaryButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
