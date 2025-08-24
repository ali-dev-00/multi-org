<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrossOrgIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_org_a_cannot_access_org_b_contact(): void
    {
        $this->seed();
        $user = User::first();

        $orgA = Organization::first();
        $orgB = Organization::create(['name' => 'Other', 'slug' => 'other', 'owner_user_id' => $user->id]);
        $orgB->users()->attach($user->id, ['role' => 'Admin']);

        $contactB = Contact::create([
            'organization_id' => $orgB->id,
            'first_name' => 'B',
            'last_name' => 'Contact',
            'email' => null,
            'phone' => null,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        $this->actingAs($user)->withSession(['current_organization_id' => $orgA->id]);

        $this->get(route('contacts.show', $contactB->id))->assertStatus(404);
    }
}









