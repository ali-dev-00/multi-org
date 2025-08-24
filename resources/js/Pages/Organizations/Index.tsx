import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface Organization {
    id: number;
    name: string;
    slug: string;
    pivot: {
        user_id: number;
        organization_id: number;
        role: string;
        created_at: string;
        updated_at: string;
    };
}

interface Props {
    organizations: Organization[];
    currentOrganizationId: number | null;
}

export default function Index({ organizations, currentOrganizationId }: Props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [switchingOrgId, setSwitchingOrgId] = useState<number | null>(null);
    
    const createForm = useForm({
        name: '',
        slug: '',
    });

    const handleSwitch = (organizationId: number) => {
        // Validate the organization ID
        if (!organizationId || organizationId <= 0) {
            console.error('Invalid organization ID:', organizationId);
            return;
        }

        // Set loading state
        setSwitchingOrgId(organizationId);

        // Debug: Log the data to submit
        console.log('Submitting organization switch:', { organization_id: organizationId });
        
        // Use router.post directly to avoid form state issues
        router.post(route('organizations.switch'), {
            organization_id: organizationId.toString()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSwitchingOrgId(null);
            },
            onError: (errors) => {
                console.error('Error switching organization:', errors);
                setSwitchingOrgId(null);
            }
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('organizations.store'), {
            onSuccess: () => {
                setShowCreateForm(false);
                createForm.reset();
            },
        });
    };

    const currentOrg = organizations.find(org => org.id === currentOrganizationId);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Organizations
                </h2>
            }
        >
            <Head title="Organizations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Current Organization */}
                            {currentOrg && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Current Organization
                                    </h3>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-blue-900">{currentOrg.name}</h4>
                                                <p className="text-sm text-blue-700">Slug: {currentOrg.slug}</p>
                                                <p className="text-sm text-blue-700">Role: {currentOrg.pivot.role}</p>
                                            </div>
                                            <div className="text-sm text-blue-600">
                                                Active
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Organizations List */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Your Organizations
                                    </h3>
                                    <PrimaryButton
                                        onClick={() => setShowCreateForm(true)}
                                        className="ml-4"
                                    >
                                        Create New Organization
                                    </PrimaryButton>
                                </div>

                                {organizations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">You don't have any organizations yet.</p>
                                        <PrimaryButton
                                            onClick={() => setShowCreateForm(true)}
                                            className="mt-4"
                                        >
                                            Create Your First Organization
                                        </PrimaryButton>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {organizations.map((organization) => (
                                            <div
                                                key={organization.id}
                                                className={`border rounded-lg p-4 ${
                                                    organization.id === currentOrganizationId
                                                        ? 'border-blue-300 bg-blue-50'
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {organization.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Slug: {organization.slug}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Role: {organization.pivot.role}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {organization.id === currentOrganizationId ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <SecondaryButton
                                                                onClick={() => handleSwitch(organization.id)}
                                                                disabled={switchingOrgId === organization.id}
                                                                className="min-w-[140px]"
                                                            >
                                                                {switchingOrgId === organization.id ? 'Switching...' : 'Switch to this organization'}
                                                            </SecondaryButton>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Create Organization Form */}
                            {showCreateForm && (
                                <div className="fixed inset-0 backdrop-blur-sm  bg-black/5 overflow-y-auto h-full w-full z-50">

                                    <div className=" border-gray-300  relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Create New Organization
                                            </h3>
                                            
                                            <form onSubmit={handleCreate}>
                                                <div className="mb-4">
                                                    <InputLabel htmlFor="name" value="Organization Name" />
                                                    <TextInput
                                                        id="name"
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={createForm.data.name}
                                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={createForm.errors.name} className="mt-2" />
                                                </div>

                                                <div className="mb-4">
                                                    <InputLabel htmlFor="slug" value="Slug (optional)" />
                                                    <TextInput
                                                        id="slug"
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={createForm.data.slug}
                                                        onChange={(e) => createForm.setData('slug', e.target.value)}
                                                        placeholder="Will be auto-generated from name if empty"
                                                    />
                                                    <InputError message={createForm.errors.slug} className="mt-2" />
                                                </div>

                                                <div className="flex justify-end space-x-3">
                                                    <SecondaryButton
                                                        type="button"
                                                        onClick={() => {
                                                            setShowCreateForm(false);
                                                            createForm.reset();
                                                        }}
                                                    >
                                                        Cancel
                                                    </SecondaryButton>
                                                    <PrimaryButton
                                                        type="submit"
                                                        disabled={createForm.processing}
                                                    >
                                                        {createForm.processing ? 'Creating...' : 'Create Organization'}
                                                    </PrimaryButton>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
