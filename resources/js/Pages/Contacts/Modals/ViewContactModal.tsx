import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'

interface Contact {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    notes?: string
    avatar_path?: string
    created_at: string
    updated_at: string
}

interface ViewContactModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contact: Contact | null
}

export default function ViewContactModal({ open, onOpenChange, contact }: ViewContactModalProps) {
    if (!contact) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this contact.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            {contact.avatar_path ? (
                                <img
                                    src={`/storage/${contact.avatar_path}`}
                                    alt="avatar"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-500 font-semibold">
                                    {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {contact.first_name} {contact.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">Contact ID: {contact.id}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <p className="text-sm text-gray-900 mt-1">{contact.first_name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <p className="text-sm text-gray-900 mt-1">{contact.last_name}</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900 mt-1">{contact.email}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900 mt-1">{contact.phone || 'Not provided'}</p>
                    </div>
                    
                    {contact.notes && (
                        <div>
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <p className="text-sm text-gray-900 mt-1">{contact.notes}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Created</label>
                            <p className="text-sm text-gray-900 mt-1">
                                {new Date(contact.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Last Updated</label>
                            <p className="text-sm text-gray-900 mt-1">
                                {new Date(contact.updated_at).toLocaleDateString()}
                            </p>
                        </div>
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
