<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory;
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar_path',
        'created_by',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (Contact $contact): void {
            if (auth()->check()) {
                $contact->created_by = $contact->created_by ?: auth()->id();
                $contact->updated_by = $contact->updated_by ?: auth()->id();
            }
        });

        static::updating(function (Contact $contact): void {
            if (auth()->check()) {
                $contact->updated_by = auth()->id();
            }
        });
    }

    public function notes(): HasMany
    {
        return $this->hasMany(ContactNote::class);
    }

    public function meta(): HasMany
    {
        return $this->hasMany(ContactMeta::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}


