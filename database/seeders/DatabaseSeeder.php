<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
        ]);

        $org = Organization::firstOrCreate([
            'slug' => 'acme',
        ], [
            'name' => 'Acme Inc',
            'owner_user_id' => $user->id,
        ]);

        $org->users()->syncWithoutDetaching([$user->id => ['role' => 'Admin']]);

        app(PermissionRegistrar::class)->setPermissionsTeamId($org->id);
        Role::findOrCreate('Admin');
        Role::findOrCreate('Member');
        $user->assignRole('Admin');

        // Member user in same org
        $member = User::firstOrCreate([
            'email' => 'member@example.com',
        ], [
            'name' => 'Member User',
            'password' => Hash::make('password'),
        ]);
        $org->users()->syncWithoutDetaching([$member->id => ['role' => 'Member']]);
        $member->assignRole('Member');
    }
}
