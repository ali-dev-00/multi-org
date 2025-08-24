<?php

namespace App\Http\Middleware;

use App\Services\CurrentOrganization;
use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\PermissionRegistrar;

class SetCurrentOrganization
{
    public function handle(Request $request, Closure $next)
    {
        $orgId = app(CurrentOrganization::class)->id();
        if ($orgId) {
            app(PermissionRegistrar::class)->setPermissionsTeamId($orgId);
        }
        return $next($request);
    }
}


