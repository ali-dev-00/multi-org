<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

Route::get('/', function () {
    return redirect()->route('contacts.index');
});

Route::get('/healthz', function () {
    return response()->json(['ok' => true]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::post('/org/switch', function (\Illuminate\Http\Request $request) {
    app(\App\Services\CurrentOrganization::class)->set((int) $request->integer('organization_id'));
    return back();
})->middleware(['auth']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/organizations', [\App\Http\Controllers\OrganizationController::class, 'index'])->name('organizations.index');
    Route::post('/organizations', [\App\Http\Controllers\OrganizationController::class, 'store'])->name('organizations.store');
    Route::post('/organizations/switch', [\App\Http\Controllers\OrganizationController::class, 'switch'])->name('organizations.switch');
    Route::get('/contacts', [\App\Http\Controllers\ContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'show'])->name('contacts.show');
    Route::post('/contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::get('/contacts/{contact}/edit', [\App\Http\Controllers\ContactController::class, 'edit'])->name('contacts.edit');
    Route::patch('/contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'update'])->name('contacts.update');
    Route::delete('/contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');
    Route::post('/contacts/{contact}/duplicate', [\App\Http\Controllers\ContactController::class, 'duplicate'])->name('contacts.duplicate');
    Route::post('/contacts/{contact}/notes', [\App\Http\Controllers\ContactController::class, 'addNote'])->name('contacts.notes.store');
    Route::patch('/contacts/{contact}/notes/{note}', [\App\Http\Controllers\ContactController::class, 'updateNote'])->name('contacts.notes.update');
    Route::delete('/contacts/{contact}/notes/{note}', [\App\Http\Controllers\ContactController::class, 'deleteNote'])->name('contacts.notes.destroy');
    Route::post('/contacts/{contact}/meta', [\App\Http\Controllers\ContactController::class, 'addMeta'])->name('contacts.meta.store');
    Route::patch('/contacts/{contact}/meta/{meta}', [\App\Http\Controllers\ContactController::class, 'updateMeta'])->name('contacts.meta.update');
    Route::delete('/contacts/{contact}/meta/{meta}', [\App\Http\Controllers\ContactController::class, 'deleteMeta'])->name('contacts.meta.destroy');
});

require __DIR__.'/auth.php';
