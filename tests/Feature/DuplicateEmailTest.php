<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DuplicateEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_duplicate_email_blocks_creation_and_returns_exact_payload(): void
    {
        $this->seed();
        $user = User::first();
        $org = Organization::first();
    
        $this->actingAs($user)
            ->withSession(['current_organization_id' => $org->id]);
    
        $contact = new Contact([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'test2222@gmail.com',
            'phone' => null,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);
        $contact->organization_id = $org->id;
        $contact->save();
    
        $response = $this->postJson(route('contacts.store'), [
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'test2222@gmail.com',
        ]);
    
        $response->assertStatus(422)
            ->assertExactJson([
                'code' => 'DUPLICATE_EMAIL',
                'existing_contact_id' => $contact->id,
            ]);
    }
    
}














