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
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Contact::class);
        $search = (string) $request->string('q');
        $contacts = Contact::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
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

    public function store(StoreContactRequest $request): RedirectResponse|
    \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        $this->authorize('create', Contact::class);
        $organizationId = app(CurrentOrganization::class)->id();

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

        $contact = new Contact();
        $contact->first_name = $validated['first_name'];
        $contact->last_name = $validated['last_name'];
        $contact->email = $validated['email'] ?? null;
        $contact->phone = $validated['phone'] ?? null;

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $contact->avatar_path = $path;
        }

        $contact->save();

        if (!empty($validated['meta'])) {
            foreach ($validated['meta'] as $pair) {
                ContactMeta::create([
                    'contact_id' => $contact->id,
                    'key' => $pair['key'],
                    'value' => $pair['value'],
                ]);
            }
        }

        return redirect()->route('contacts.show', $contact);
    }

    public function show(Contact $contact): Response
    {
        $this->authorize('view', $contact);
        $contact->load(['notes' => function ($q) {
            $q->with('user')->latest();
        }, 'meta']);
        return Inertia::render('Contacts/Show', [
            'contact' => $contact,
            'duplicate' => (bool) request()->boolean('duplicate'),
        ]);
    }

    public function edit(Contact $contact): Response
    {
        $this->authorize('update', $contact);
        $contact->load('meta');
        return Inertia::render('Contacts/Edit', [
            'contact' => $contact,
        ]);
    }

    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse
    {
        $this->authorize('update', $contact);
        $validated = $request->validated();

        if (!empty($validated['email'])) {
            $exists = Contact::query()
                ->where('email', $validated['email'])
                ->where('id', '!=', $contact->id)
                ->exists();
            if ($exists) {
                return back()->withErrors(['email' => 'Email already in use by another contact.']);
            }
        }

        $contact->fill([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $contact->avatar_path = $path;
        }

        $contact->save();

        // Replace meta
        ContactMeta::where('contact_id', $contact->id)->delete();
        if (!empty($validated['meta'])) {
            foreach ($validated['meta'] as $pair) {
                ContactMeta::create([
                    'contact_id' => $contact->id,
                    'key' => $pair['key'],
                    'value' => $pair['value'],
                ]);
            }
        }

        return redirect()->route('contacts.show', $contact);
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $this->authorize('delete', $contact);
        $contact->delete();
        return redirect()->route('contacts.index');
    }

    public function duplicate(Contact $contact): RedirectResponse
    {
        $this->authorize('create', Contact::class);
        
        // Create a new contact with all the same data except email
        $new = $contact->replicate(['email']);
        $new->email = null;
        $new->save();
        
        // Copy all custom fields (meta)
        foreach ($contact->meta as $pair) {
            ContactMeta::create([
                'contact_id' => $new->id,
                'key' => $pair->key,
                'value' => $pair->value,
            ]);
        }
        
        // Copy all notes
        foreach ($contact->notes as $note) {
            ContactNote::create([
                'contact_id' => $new->id,
                'user_id' => auth()->id(),
                'body' => $note->body,
            ]);
        }
        
        return redirect()->route('contacts.show', $new);
    }

    public function addNote(Request $request, Contact $contact): RedirectResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);
        ContactNote::create([
            'contact_id' => $contact->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);
        return back();
    }

    public function updateNote(Request $request, Contact $contact, ContactNote $note): RedirectResponse
    {
        abort_unless($note->user_id === $request->user()->id, 403);
        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);
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
            'key' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:1000'],
        ]);

        // Check if we already have 5 custom fields
        if ($contact->meta()->count() >= 5) {
            return back()->withErrors(['meta' => 'Maximum 5 custom fields allowed.']);
        }

        ContactMeta::create([
            'contact_id' => $contact->id,
            'key' => $validated['key'],
            'value' => $validated['value'],
        ]);

        return back();
    }

    public function updateMeta(Request $request, Contact $contact, ContactMeta $meta): RedirectResponse
    {
        $this->authorize('update', $contact);
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:1000'],
        ]);

        $meta->update([
            'key' => $validated['key'],
            'value' => $validated['value'],
        ]);

        return back();
    }

    public function deleteMeta(Request $request, Contact $contact, ContactMeta $meta): RedirectResponse
    {
        $this->authorize('update', $contact);
        $meta->delete();
        return back();
    }
}


