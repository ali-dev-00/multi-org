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
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import SecondaryButton from '@/Components/SecondaryButton'
import PrimaryButton from '@/Components/PrimaryButton'

interface CreateContactModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateContactModal({ open, onOpenChange }: CreateContactModalProps) {
    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        notes: '',
        custom_fields: {}
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        form.post(route('contacts.store'), {
            onSuccess: () => {
                onOpenChange(false)
                form.reset()
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='' >
                <DialogHeader>
                    <DialogTitle>Create New Contact</DialogTitle>
                    <DialogDescription>
                        Add a new contact to your organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                    required
                                      className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                    required
                                      className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                                  className='mt-2 border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                  className='mt-2 border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Add any notes about this contact..."
                                  className='mt-2 border-gray-300 rounded-md'
                            />
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
                            {form.processing ? 'Creating...' : 'Create Contact'}
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
