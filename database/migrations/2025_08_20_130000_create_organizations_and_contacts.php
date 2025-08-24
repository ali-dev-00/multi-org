<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('owner_user_id')->constrained('users');
            $table->timestamps();
        });

        Schema::create('organization_user', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role');
            $table->timestamps();
            $table->unique(['organization_id', 'user_id']);
        });

        // Enable Spatie teams column names to align with organization scoping
        // roles table: add organization_id when teams are enabled. If package migration already added team_id,
        // we leave it; permissions checks will use configured team_foreign_key = organization_id.
        if (!Schema::hasColumn('roles', 'organization_id')) {
            Schema::table('roles', function (Blueprint $table): void {
                $table->unsignedBigInteger('organization_id')->nullable()->index()->after('guard_name');
            });
        }

        if (!Schema::hasColumn('model_has_roles', 'organization_id')) {
            Schema::table('model_has_roles', function (Blueprint $table): void {
                $table->unsignedBigInteger('organization_id')->nullable()->index()->after('role_id');
                $table->unique(['role_id', 'model_id', 'model_type', 'organization_id'], 'model_has_roles_role_model_org_unique');
            });
        }

        if (!Schema::hasColumn('model_has_permissions', 'organization_id')) {
            Schema::table('model_has_permissions', function (Blueprint $table): void {
                $table->unsignedBigInteger('organization_id')->nullable()->index()->after('permission_id');
                $table->unique(['permission_id', 'model_id', 'model_type', 'organization_id'], 'model_has_permissions_perm_model_org_unique');
            });
        }

        Schema::create('contacts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar_path')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamps();
            $table->index(['organization_id', 'last_name', 'first_name']);
        });

        // Case-insensitive unique per organization for email (SQLite is case-insensitive by default for TEXT)
        Schema::table('contacts', function (Blueprint $table): void {
            $table->unique(['organization_id', 'email']);
        });

        Schema::create('contact_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->text('body');
            $table->timestamps();
        });

        Schema::create('contact_meta', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->string('key');
            $table->string('value');
            $table->timestamps();
            $table->index(['contact_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_meta');
        Schema::dropIfExists('contact_notes');
        Schema::dropIfExists('contacts');
        if (Schema::hasColumn('model_has_permissions', 'organization_id')) {
            Schema::table('model_has_permissions', function (Blueprint $table): void {
                $table->dropUnique('model_has_permissions_perm_model_org_unique');
                $table->dropColumn('organization_id');
            });
        }
        if (Schema::hasColumn('model_has_roles', 'organization_id')) {
            Schema::table('model_has_roles', function (Blueprint $table): void {
                $table->dropUnique('model_has_roles_role_model_org_unique');
                $table->dropColumn('organization_id');
            });
        }
        if (Schema::hasColumn('roles', 'organization_id')) {
            Schema::table('roles', function (Blueprint $table): void {
                $table->dropColumn('organization_id');
            });
        }
        Schema::dropIfExists('organization_user');
        Schema::dropIfExists('organizations');
    }
};


