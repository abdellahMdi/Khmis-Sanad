<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $coopId = $this->user()?->cooperative?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('cooperatives', 'name')->ignore($coopId)],
            'bio' => ['nullable', 'string'],
            'terroir' => ['nullable', 'string', 'max:255'],
            'hq_location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
