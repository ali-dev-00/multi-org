import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Textarea } from '@/Components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/Components/ui/dialog'
import EditContactModal from './Modals/EditContactModal'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'

interface ContactNote {
    id: number
    body: string
    user_id: number
    created_at: string
    updated_at: string
    user: {
        name: string
    }
}

interface ContactMeta {
    id: number
    key: string
    value: string
}

interface Contact {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    avatar_path?: string
    notes: ContactNote[]
    meta: ContactMeta[]
    created_at: string
    updated_at: string
}

interface Props {
    contact: Contact
    duplicate?: boolean
}

export default function ContactShow({ contact, duplicate }: Props) {
    const [showAddNoteModal, setShowAddNoteModal] = useState(false)
    const [showEditNoteModal, setShowEditNoteModal] = useState(false)
    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false)
    const [showAddMetaModal, setShowAddMetaModal] = useState(false)
    const [showEditMetaModal, setShowEditMetaModal] = useState(false)
    const [showDeleteMetaModal, setShowDeleteMetaModal] = useState(false)
    const [showEditContactModal, setShowEditContactModal] = useState(false)
    const [selectedNote, setSelectedNote] = useState<ContactNote | null>(null)
    const [selectedMeta, setSelectedMeta] = useState<ContactMeta | null>(null)

    // Debug: Log notes data to console
    useEffect(() => {
        console.log('Contact notes:', contact.notes)
        console.log('First note user:', contact.notes[0]?.user)
    }, [contact.notes])

    const noteForm = useForm({
        body: ''
    })

    const metaForm = useForm({
        key: '',
        value: ''
    })

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault()
        if (!noteForm.data.body.trim()) {
            return
        }
        noteForm.post(route('contacts.notes.store', contact.id), {
            onSuccess: () => {
                setShowAddNoteModal(false)
                noteForm.reset()
            },
            onError: (errors) => {
                console.error('Error adding note:', errors)
            }
        })
    }

    const handleEditNote = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedNote || !noteForm.data.body.trim()) {
            return
        }
        noteForm.patch(route('contacts.notes.update', [contact.id, selectedNote.id]), {
            onSuccess: () => {
                setShowEditNoteModal(false)
                noteForm.reset()
                setSelectedNote(null)
            },
            onError: (errors) => {
                console.error('Error updating note:', errors)
            }
        })
    }

    const handleDeleteNote = () => {
        if (!selectedNote) {
            return
        }
        noteForm.delete(route('contacts.notes.destroy', [contact.id, selectedNote.id]), {
            onSuccess: () => {
                setShowDeleteNoteModal(false)
                setSelectedNote(null)
            },
            onError: (errors) => {
                console.error('Error deleting note:', errors)
            }
        })
    }

    const handleAddMeta = (e: React.FormEvent) => {
        e.preventDefault()
        if (contact.meta.length >= 5) {
            alert('Maximum 5 custom fields allowed')
            return
        }
        if (!metaForm.data.key.trim() || !metaForm.data.value.trim()) {
            alert('Field Name and Value cannot be empty.')
            return
        }
        metaForm.post(route('contacts.meta.store', contact.id), {
            onSuccess: () => {
                setShowAddMetaModal(false)
                metaForm.reset()
            },
            onError: (errors) => {
                console.error('Error adding meta:', errors)
            }
        })
    }

    const handleEditMeta = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMeta || !metaForm.data.key.trim() || !metaForm.data.value.trim()) {
            return
        }
        metaForm.patch(route('contacts.meta.update', [contact.id, selectedMeta.id]), {
            onSuccess: () => {
                setShowEditMetaModal(false)
                metaForm.reset()
                setSelectedMeta(null)
            },
            onError: (errors) => {
                console.error('Error updating meta:', errors)
            }
        })
    }

    const handleDeleteMeta = () => {
        if (!selectedMeta) {
            return
        }
        metaForm.delete(route('contacts.meta.destroy', [contact.id, selectedMeta.id]), {
            onSuccess: () => {
                setShowDeleteMetaModal(false)
                setSelectedMeta(null)
            },
            onError: (errors) => {
                console.error('Error deleting meta:', errors)
            }
        })
    }

    const openEditNoteModal = (note: ContactNote) => {
        setSelectedNote(note)
        noteForm.setData('body', note.body)
        setShowEditNoteModal(true)
    }

    const openDeleteNoteModal = (note: ContactNote) => {
        setSelectedNote(note)
        setShowDeleteNoteModal(true)
    }

    const openEditMetaModal = (meta: ContactMeta) => {
        setSelectedMeta(meta)
        metaForm.setData('key', meta.key)
        metaForm.setData('value', meta.value)
        setShowEditMetaModal(true)
    }

    const openDeleteMetaModal = (meta: ContactMeta) => {
        setSelectedMeta(meta)
        setShowDeleteMetaModal(true)
    }

    const handleDuplicate = () => {
        if (confirm(`Are you sure you want to duplicate "${contact.first_name} ${contact.last_name}"? This will create a copy with all the same information except the email will be cleared.`)) {
            // Use Inertia to post to the duplicate route
            router.post(route('contacts.duplicate', contact.id), {}, {
                onSuccess: () => {
                    // The page will redirect to the new contact
                },
                onError: (errors) => {
                    console.error('Error duplicating contact:', errors);
                    alert('Failed to duplicate contact. Please try again.');
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Contact Details
                    </h2>
                    <div className="flex gap-2">
                        <PrimaryButton
                            onClick={() => handleDuplicate()}
                            className='cursor-pointer'
                        >
                            Duplicate Contact
                        </PrimaryButton>
                        {/* <PrimaryButton
                            onClick={() => setShowEditContactModal(true)}
                            className='cursor-pointer'
                        >
                            Edit Contact
                        </PrimaryButton> */}
                        <Link href={route('contacts.index')}>
                            <PrimaryButton className='cursor-pointer'>Back to Contacts</PrimaryButton>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${contact.first_name} ${contact.last_name}`} />

            {duplicate && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                        <strong>Duplicate detected.</strong> No new contact was created.
                    </p>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6">
                        {/* Contact Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        {contact.avatar_path ? (
                                            <img
                                                src={`/storage/${contact.avatar_path}`}
                                                alt="avatar"
                                                className="h-24 w-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500 font-semibold">
                                                {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">First Name</Label>
                                                <p className="text-sm text-gray-900 mt-1">{contact.first_name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                                                <p className="text-sm text-gray-900 mt-1">{contact.last_name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                                            <p className="text-sm text-gray-900 mt-1">{contact.email || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                            <p className="text-sm text-gray-900 mt-1">{contact.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Created</Label>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {new Date(contact.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {new Date(contact.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Custom Fields Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Custom Fields</CardTitle>
                                <PrimaryButton
                                    onClick={() => setShowAddMetaModal(true)}
                                    disabled={contact.meta.length >= 5}
                                    className='cursor-pointer'
                                >
                                    Add Field
                                </PrimaryButton>
                            </CardHeader>
                            <CardContent>
                                {contact.meta.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No custom fields added yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {contact.meta.map((meta) => (
                                            <div key={meta.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                <div className="flex-1">
                                                    <span className="font-medium text-gray-900">{meta.key}:</span>
                                                    <span className="ml-2 text-gray-700">{meta.value}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <SecondaryButton
                                                        onClick={() => openEditMetaModal(meta)}
                                                        variant="default"
                                                        className='cursor-pointer' 
                                                    >
                                                        Edit
                                                    </SecondaryButton>
                                                    <SecondaryButton
                                                        onClick={() => openDeleteMetaModal(meta)}
                                                        variant="destructive"
                                                        className='cursor-pointer' 
                                                    >
                                                        Delete
                                                    </SecondaryButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {contact.meta.length >= 5 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Maximum 5 custom fields reached.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Notes</CardTitle>
                                <PrimaryButton
                                    onClick={() => setShowAddNoteModal(true)}
                                >
                                    Add Note
                                </PrimaryButton>
                            </CardHeader>
                            <CardContent>
                                {contact.notes.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No notes added yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {contact.notes.filter(note => note.user).map((note) => (
                                            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-gray-900 mb-2">{note.body}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span>By: {note.user?.name || 'Unknown User'}</span>
                                                            <span>
                                                                {new Date(note.created_at).toLocaleDateString()}
                                                                {note.updated_at !== note.created_at && ' (edited)'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <SecondaryButton
                                                            onClick={() => openEditNoteModal(note)}
                                                            variant="default"
                                                             className='cursor-pointer'      
                                                        >
                                                            Edit
                                                        </SecondaryButton>
                                                        <SecondaryButton
                                                            onClick={() => openDeleteNoteModal(note)}
                                                            variant="destructive"
                                                            className='cursor-pointer'  
                                                           
                                                        >
                                                            Delete
                                                        </SecondaryButton>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {contact.notes.filter(note => !note.user).length > 0 && (
                                            <div className="text-sm text-gray-500 text-center py-2">
                                                {contact.notes.filter(note => !note.user).length} note(s) without user information
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add Note Modal */}
            <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>
                            Add a new note to this contact.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddNote}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="note_body">Note</Label>
                                <Textarea
                                    id="note_body"
                                    value={noteForm.data.body}
                                    className='mt-3'
                                    onChange={(e) => noteForm.setData('body', e.target.value)}
                                    placeholder="Enter your note..."
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <SecondaryButton 
                                type="button" 
                                onClick={() => setShowAddNoteModal(false)}
                                className='cursor-pointer'
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className='cursor-pointer' type="submit" disabled={noteForm.processing}>
                                {noteForm.processing ? 'Adding...' : 'Add Note'}
                            </PrimaryButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Note Modal */}
            <Dialog open={showEditNoteModal} onOpenChange={setShowEditNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>
                            Update the note content.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditNote}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="edit_note_body">Note</Label>
                                <Textarea
                                    id="edit_note_body"
                                    value={noteForm.data.body}
                                    onChange={(e) => noteForm.setData('body', e.target.value)}
                                    placeholder="Enter your note..."
                                    required
                                    className='mt-2'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <SecondaryButton 
                                type="button" 
                                variant="default" 
                                onClick={() => setShowEditNoteModal(false)}
                                className='cursor-pointer'
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className='cursor-pointer' type="submit" disabled={noteForm.processing}>
                                {noteForm.processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Note Modal */}
            <Dialog open={showDeleteNoteModal} onOpenChange={setShowDeleteNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Note</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this note? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <SecondaryButton 
                            variant="default" 
                            onClick={() => setShowDeleteNoteModal(false)}
                            className='cursor-pointer'
                        >
                            Cancel
                        </SecondaryButton>
                        <SecondaryButton 
                            variant="destructive" 
                            
                            onClick={handleDeleteNote}
                            disabled={noteForm.processing}
                            className="text-red-600 cursor-pointer border-red-600 hover:bg-red-50"
                        >
                            {noteForm.processing ? 'Deleting...' : 'Delete Note'}
                        </SecondaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Meta Modal */}
            <Dialog open={showAddMetaModal} onOpenChange={setShowAddMetaModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Custom Field</DialogTitle>
                        <DialogDescription>
                            Add a new custom field to this contact.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMeta}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="meta_key">Field Name</Label>
                                <Input
                                    id="meta_key"
                                    value={metaForm.data.key}
                                    onChange={(e) => metaForm.setData('key', e.target.value)}
                                    placeholder="e.g., Company, Title, etc."
                                    required
                                      className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                            <div>
                                <Label htmlFor="meta_value">Field Value</Label>
                                <Input
                                    id="meta_value"
                                    value={metaForm.data.value}
                                    onChange={(e) => metaForm.setData('value', e.target.value)}
                                    placeholder="Enter the value..."
                                    required
                                      className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <SecondaryButton 
                                type="button" 
                                variant="default" 
                                onClick={() => setShowAddMetaModal(false)}
                                className='cursor-pointer'
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton  className='cursor-pointer'  type="submit" disabled={metaForm.processing}>
                                {metaForm.processing ? 'Adding...' : 'Add Field'}
                            </PrimaryButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Meta Modal */}
            <Dialog open={showEditMetaModal} onOpenChange={setShowEditMetaModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Custom Field</DialogTitle>
                        <DialogDescription>
                            Update the custom field information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditMeta}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="edit_meta_key">Field Name</Label>
                                <Input
                                    id="edit_meta_key"
                                    value={metaForm.data.key}
                                    onChange={(e) => metaForm.setData('key', e.target.value)}
                                    placeholder="e.g., Company, Title, etc."
                                    required
                                    className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_meta_value">Field Value</Label>
                                <Input
                                    id="edit_meta_value"
                                    value={metaForm.data.value}
                                    onChange={(e) => metaForm.setData('value', e.target.value)}
                                    placeholder="Enter the value..."
                                    required
                                      className='mt-2 border-gray-300 rounded-md'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <SecondaryButton 
                                variant="default" 
                                onClick={() => setShowEditMetaModal(false)}
                                className='cursor-pointer'
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className='cursor-pointer' type="submit" disabled={metaForm.processing}>
                                {metaForm.processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Meta Modal */}
            <Dialog open={showDeleteMetaModal} onOpenChange={setShowDeleteMetaModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Custom Field</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this custom field? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <SecondaryButton 
                        className='cursor-pointer'
                            variant="default" 
                            onClick={() => setShowDeleteMetaModal(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <SecondaryButton 
                            variant="destructive" 
                            onClick={handleDeleteMeta}
                            disabled={metaForm.processing}
                            className="cursor-pointer"
                        >
                            {metaForm.processing ? 'Deleting...' : 'Delete Field'}
                        </SecondaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Contact Modal */}
            <EditContactModal
                open={showEditContactModal}
                onOpenChange={setShowEditContactModal}
                contact={contact}
            />
        </AuthenticatedLayout>
    )
}
