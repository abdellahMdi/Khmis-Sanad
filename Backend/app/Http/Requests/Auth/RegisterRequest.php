<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'firstname' => ['required', 'string', 'max:50'],
            'lastname' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()],
            'telephone' => ['nullable', 'string', 'max:50'],
            'role' => ['nullable', 'string', Rule::in(['client', 'artisan'])],
            'shop_name' => ['required_if:role,artisan', 'nullable', 'string', 'max:50', 'unique:cooperatives,name'],
            'bio' => ['nullable', 'string'],
            'terroir' => ['nullable', 'string', 'max:255'],
            'hq_location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
