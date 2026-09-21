<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShopProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'prix' => ['sometimes', 'required', 'numeric', 'min:0'],
            'prix_remise' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'cat_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['url', 'max:255'],
        ];
    }
}
