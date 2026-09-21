<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;

class UploadShopProofRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'proof.required' => 'Joignez un justificatif (PDF, JPG ou PNG).',
            'proof.mimes' => 'Formats acceptés : PDF, JPG, PNG.',
            'proof.max' => 'Le fichier ne doit pas dépasser 5 Mo.',
        ];
    }
}
