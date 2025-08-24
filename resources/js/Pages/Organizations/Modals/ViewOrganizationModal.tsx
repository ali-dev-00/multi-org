import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'

interface Organization {
    id: number
    name: string
    slug: string
    pivot: {
        user_id: number
        organization_id: number
        role: string
        created_at: string
        updated_at: string
    }
}

interface ViewOrganizationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organization: Organization | null
}

export default function ViewOrganizationModal({ open, onOpenChange, organization }: ViewOrganizationModalProps) {
    if (!organization) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Organization Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900 mt-1">{organization.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Slug</label>
                        <p className="text-sm text-gray-900 mt-1">{organization.slug}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Your Role</label>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{organization.pivot.role}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Member Since</label>
                        <p className="text-sm text-gray-900 mt-1">
                            {new Date(organization.pivot.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


