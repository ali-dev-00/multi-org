<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Services\CurrentOrganization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $organizations = $request->user()?->organizations()->get(['organizations.id', 'organizations.name', 'organizations.slug']);
        return Inertia::render('Organizations/Index', [
            'organizations' => $organizations,
            'currentOrganizationId' => app(CurrentOrganization::class)->id(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:organizations,slug'],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        $organization = Organization::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'owner_user_id' => $request->user()->id,
        ]);

        $organization->users()->attach($request->user()->id, ['role' => 'Admin']);
        // Ensure roles exist in this org context
        app(\Spatie\Permission\PermissionRegistrar::class)->setPermissionsTeamId($organization->id);
        Role::findOrCreate('Admin');
        Role::findOrCreate('Member');
        $request->user()->assignRole('Admin');
        app(CurrentOrganization::class)->set($organization->id);

        return redirect()->route('organizations.index');
    }

    public function switch(Request $request): RedirectResponse
    {
        $request->validate(['organization_id' => ['required', 'integer']]);
        $orgId = (int) $request->integer('organization_id');
        $owns = $request->user()->organizations()->where('organizations.id', $orgId)->exists();
        abort_unless($owns, 403);
        app(CurrentOrganization::class)->set($orgId);
        return back();
    }
}


