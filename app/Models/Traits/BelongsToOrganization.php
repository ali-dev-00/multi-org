<?php

namespace App\Models\Traits;

use App\Services\CurrentOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::creating(function (Model $model): void {
            if (empty($model->organization_id)) {
                $model->organization_id = app(CurrentOrganization::class)->id();
            }
        });

        static::addGlobalScope('organization', function (Builder $builder): void {
            $currentOrgId = app(CurrentOrganization::class)->id();
            if ($currentOrgId !== null) {
                $builder->where($builder->getModel()->getTable().'.organization_id', $currentOrgId);
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Organization::class);
    }
}


