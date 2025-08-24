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

interface Organization {
    id: number
    name: string
    slug: string
}

interface EditOrganizationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organization: Organization | null
}

export default function EditOrganizationModal({ open, onOpenChange, organization }: EditOrganizationModalProps) {
    const form = useForm({
        name: organization?.name || '',
        slug: organization?.slug || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (organization) {
            form.put(route('organizations.update', organization.id), {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Organization</DialogTitle>
                    <DialogDescription>
                        Update organization information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="edit_name">Organization Name</Label>
                            <Input
                                id="edit_name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_slug">Slug</Label>
                            <Input
                                id="edit_slug"
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


