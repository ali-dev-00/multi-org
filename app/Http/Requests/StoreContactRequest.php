<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email:rfc,dns'],
            'phone' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:3072'],
            'meta' => ['array', 'max:5'],
            'meta.*.key' => ['required_with:meta', 'string', 'max:255'],
            'meta.*.value' => ['required_with:meta', 'string', 'max:255'],
        ];
    }
}


