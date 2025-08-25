<?php

namespace App\Providers;

use App\Models\Contact;
use App\Policies\ContactPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Contact::class => ContactPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}














