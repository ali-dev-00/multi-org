<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactMeta;
use App\Models\ContactNote;
use App\Services\CurrentOrganization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Contact::class);

        $search = (string) $request->string('q');

        $contacts = Contact::query()
            ->when($search, fn($q) =>
                $q->where(fn($qq) =>
                    $qq->where('first_name', 'like', "%{$search}%")
                       ->orWhere('last_name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                )
            )
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'email', 'phone', 'avatar_path']);

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Contact::class);
        return Inertia::render('Contacts/Create');
    }

    public function store(StoreContactRequest $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $this->authorize('create', Contact::class);

        $organizationId = app(CurrentOrganization::class)->id();

        // Duplicate email check
        if (!empty($validated['email'])) {
            $existing = Contact::query()
                ->withoutGlobalScope('organization')
                ->where('organization_id', $organizationId)
                ->whereRaw('lower(email) = lower(?)', [$validated['email']])
                ->first(['id']);

            if ($existing) {
                Log::info('duplicate_contact_blocked', [
                    'org_id' => $organizationId,
                    'email' => $validated['email'],
                    'user_id' => $request->user()->id,
                ]);
                return response()->json([
                    'code' => 'DUPLICATE_EMAIL',
                    'existing_contact_id' => $existing->id,
                ], 422);
            }
        }

        $contact = Contact::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'] ?? null,
            'phone'      => $validated['phone'] ?? null,
        ]);

        $this->handleAvatarUpload($request, $contact);
        $this->syncMeta($contact, $validated['meta'] ?? []);

        return to_route('contacts.show', $contact);
    }

    public function show(Contact $contact): Response
    {
        $this->authorize('view', $contact);

        $contact->load([
            'notes.user' => fn($q) => $q->latest(),
            'meta'
        ]);

        return Inertia::render('Contacts/Show', [
            'contact'   => $contact,
            'duplicate' => (bool) request()->boolean('duplicate'),
        ]);
    }

    public function edit(Contact $contact): Response
    {
        $this->authorize('update', $contact);
        $contact->load('meta');

        return Inertia::render('Contacts/Edit', compact('contact'));
    }

    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse
    {
        $this->authorize('update', $contact);
        $validated = $request->validated();

        if (!empty($validated['email'])) {
            $exists = Contact::where('email', $validated['email'])
                ->where('id', '!=', $contact->id)
                ->exists();
            if ($exists) {
                return back()->withErrors(['email' => 'Email already in use by another contact.']);
            }
        }

        $contact->update([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'] ?? null,
            'phone'      => $validated['phone'] ?? null,
        ]);

        $this->handleAvatarUpload($request, $contact);
        $this->syncMeta($contact, $validated['meta'] ?? [], true);

        return to_route('contacts.show', $contact);
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $this->authorize('delete', $contact);
        $contact->delete();

        return to_route('contacts.index');
    }

    public function duplicate(Contact $contact): RedirectResponse
    {
        $this->authorize('create', Contact::class);

        $new = $contact->replicate(['email']);
        $new->email = null;
        $new->save();

        $new->meta()->createMany($contact->meta->toArray());

        $new->notes()->createMany(
            $contact->notes->map(fn($note) => [
                'user_id' => auth()->id(),
                'body'    => $note->body,
            ])->toArray()
        );

        return to_route('contacts.show', $new);
    }

    public function addNote(Request $request, Contact $contact): RedirectResponse
    {
        $validated = $request->validate(['body' => ['required', 'string']]);

        $contact->notes()->create([
            'user_id' => $request->user()->id,
            'body'    => $validated['body'],
        ]);

        return back();
    }

    public function updateNote(Request $request, Contact $contact, ContactNote $note): RedirectResponse
    {
        abort_unless($note->user_id === $request->user()->id, 403);

        $validated = $request->validate(['body' => ['required', 'string']]);
        $note->update(['body' => $validated['body']]);

        return back();
    }

    public function deleteNote(Request $request, Contact $contact, ContactNote $note): RedirectResponse
    {
        abort_unless($note->user_id === $request->user()->id, 403);
        $note->delete();

        return back();
    }

    public function addMeta(Request $request, Contact $contact): RedirectResponse
    {
        $this->authorize('update', $contact);

        $validated = $request->validate([
            'key'   => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:1000'],
        ]);

        if ($contact->meta()->count() >= 5) {
            return back()->withErrors(['meta' => 'Maximum 5 custom fields allowed.']);
        }

        $contact->meta()->create($validated);

        return back();
    }

    public function updateMeta(Request $request, Contact $contact, ContactMeta $meta): RedirectResponse
    {
        $this->authorize('update', $contact);

        $validated = $request->validate([
            'key'   => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:1000'],
        ]);

        $meta->update($validated);

        return back();
    }

    public function deleteMeta(Request $request, Contact $contact, ContactMeta $meta): RedirectResponse
    {
        $this->authorize('update', $contact);
        $meta->delete();

        return back();
    }

    /**
     * Handle avatar upload if provided
     */
    private function handleAvatarUpload(Request $request, Contact $contact): void
    {
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $contact->update(['avatar_path' => $path]);
        }
    }

    /**
     * Sync meta fields for a contact
     */
    private function syncMeta(Contact $contact, array $metaData, bool $replace = false): void
    {
        if ($replace) {
            $contact->meta()->delete();
        }

        if (!empty($metaData)) {
            $contact->meta()->createMany($metaData);
        }
    }
}
