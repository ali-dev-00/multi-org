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

interface Organization {
    id: number
    name: string
}

interface DeleteOrganizationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organization: Organization | null
}

export default function DeleteOrganizationModal({ open, onOpenChange, organization }: DeleteOrganizationModalProps) {
    const form = useForm({})

    const handleDelete = () => {
        if (organization) {
            form.delete(route('organizations.destroy', organization.id), {
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
                    <DialogTitle>Delete Organization</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{' '}
                        <strong>{organization?.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={form.processing}
                    >
                        {form.processing ? 'Deleting...' : 'Delete Organization'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


