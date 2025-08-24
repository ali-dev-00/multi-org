<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Member']);
    }

    public function view(User $user, Contact $contact): bool
    {
        return $user->hasAnyRole(['Admin', 'Member']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Admin');
    }

    public function update(User $user, Contact $contact): bool
    {
        return $user->hasRole('Admin');
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $user->hasRole('Admin');
    }
}









