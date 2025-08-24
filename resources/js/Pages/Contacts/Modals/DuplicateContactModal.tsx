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
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'

interface Contact {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    notes?: string
}

interface DuplicateContactModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contact: Contact | null
}

export default function DuplicateContactModal({ open, onOpenChange, contact }: DuplicateContactModalProps) {
    const form = useForm({})

    const handleDuplicate = () => {
        if (contact) {
            form.post(route('contacts.duplicate', contact.id), {
                onSuccess: () => {
                    onOpenChange(false)
                },
                onError: (errors) => {
                    console.error('Error duplicating contact:', errors)
                }
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Duplicate Contact</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to duplicate "{contact?.first_name} {contact?.last_name}"?
                        <br /><br />
                        This will create an exact copy with all the same information, custom fields, and notes, except the email will be cleared.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <SecondaryButton 
                        type="button" 
                        variant="default" 
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton 
                        onClick={handleDuplicate}
                        disabled={form.processing}
                    >
                        {form.processing ? 'Duplicating...' : 'Duplicate Contact'}
                    </PrimaryButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
