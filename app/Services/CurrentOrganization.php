<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class CurrentOrganization
{
    public const SESSION_KEY = 'current_organization_id';

    public function id(): ?int
    {
        $orgId = Session::get(self::SESSION_KEY);
        if ($orgId) {
            return (int) $orgId;
        }

        $user = auth()->user();
        if ($user instanceof Authenticatable) {
            $firstOrgId = Organization::query()
                ->whereHas('users', function ($q) use ($user): void {
                    $q->where('user_id', $user->getAuthIdentifier());
                })
                ->value('id');

            if ($firstOrgId) {
                $this->set((int) $firstOrgId);
                return (int) $firstOrgId;
            }
        }

        return null;
    }

    public function set(int $organizationId): void
    {
        Session::put(self::SESSION_KEY, $organizationId);
    }
}


