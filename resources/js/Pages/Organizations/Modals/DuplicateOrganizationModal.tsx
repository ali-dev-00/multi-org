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

interface DuplicateOrganizationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organization: Organization | null
}

export default function DuplicateOrganizationModal({ open, onOpenChange, organization }: DuplicateOrganizationModalProps) {
    const form = useForm({
        name: organization ? `${organization.name} (Copy)` : '',
        slug: organization ? `${organization.slug}-copy` : '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (organization) {
            form.post(route('organizations.duplicate', organization.id), {
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
                    <DialogTitle>Duplicate Organization</DialogTitle>
                    <DialogDescription>
                        Create a copy of "{organization?.name}" with a new name and slug.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="duplicate_name">New Organization Name</Label>
                            <Input
                                id="duplicate_name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="duplicate_slug">New Slug</Label>
                            <Input
                                id="duplicate_slug"
                                value={form.data.slug}
                                onChange={(e) => form.setData('slug', e.target.value)}
                                required
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
                            {form.processing ? 'Duplicating...' : 'Duplicate Organization'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


