import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { useState } from 'react'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import { 
    CreateContactModal,
    EditContactModal,
    DeleteContactModal,
    DuplicateContactModal
} from './Modals'
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

interface Props {
    contacts: Contact[]
}

export default function ContactsIndex({ contacts }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDuplicateModal, setShowDuplicateModal] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    const searchForm = useForm({ q: '' })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        searchForm.get(route('contacts.index'), {
            preserveState: true,
            preserveScroll: true
        })
    }

    const openEditModal = (contact: Contact) => {
        setSelectedContact(contact)
        setShowEditModal(true)
    }

    const openDeleteModal = (contact: Contact) => {
        setSelectedContact(contact)
        setShowDeleteModal(true)
    }

    const openDuplicateModal = (contact: Contact) => {
        setSelectedContact(contact)
        setShowDuplicateModal(true)
    }



    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Contacts
                </h2>
            }
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Search and Create Button */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Your Contacts
                                </h3>
                                <div className="flex items-center gap-2">
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search contacts..."
                                            value={searchForm.data.q}
                                            onChange={(e) => searchForm.setData('q', e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                                        />
                                        <PrimaryButton>
                                            Search
                                        </PrimaryButton>
                                    </form>
                                    <PrimaryButton
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        Create New Contact
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* Contacts List */}
                            {contacts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">You don't have any contacts yet.</p>
                                    <PrimaryButton
                                        onClick={() => setShowCreateModal(true)}
                                        className="mt-4"
                                    >
                                        Create Your First Contact
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {contacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        {contact.avatar_path ? (
                                                            <img
                                                                src={`/storage/${contact.avatar_path}`}
                                                                alt="avatar"
                                                                className="h-12 w-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12  rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 font-semibold">
                                                                {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link 
                                                            href={route('contacts.show', contact.id)}
                                                            className="hover:underline"
                                                        >
                                                            <h4 className="font-medium text-blue-500 hover:underline">
                                                                {contact.first_name} {contact.last_name}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-sm text-gray-600">{contact.email}</p>
                                                        {contact.phone && (
                                                            <p className="text-sm text-gray-600">{contact.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <SecondaryButton
                                                        onClick={() => openEditModal(contact)}
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </SecondaryButton>
                                                    <SecondaryButton
                                                        onClick={() => openDuplicateModal(contact)}
                                                        size="sm"
                                                    >
                                                        Duplicate
                                                    </SecondaryButton>
                                                    <SecondaryButton
                                                        onClick={() => openDeleteModal(contact)}
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        Delete
                                                    </SecondaryButton>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>





            {/* Modals */}
            <CreateContactModal 
                open={showCreateModal} 
                onOpenChange={setShowCreateModal} 
            />
            
            <EditContactModal 
                open={showEditModal} 
                onOpenChange={setShowEditModal}
                contact={selectedContact as any}
            />
            
            <DeleteContactModal 
                open={showDeleteModal} 
                onOpenChange={setShowDeleteModal}
                contact={selectedContact}
            />
            
            <DuplicateContactModal 
                open={showDuplicateModal} 
                onOpenChange={setShowDuplicateModal}
                contact={selectedContact}
            />
            

        </AuthenticatedLayout>
    )
}


