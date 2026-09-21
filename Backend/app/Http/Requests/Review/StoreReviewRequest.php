<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                Rule::unique('avis', 'product_id')->where(
                    fn ($query) => $query->where('user_id', $this->user()?->id)
                ),
            ],
            'note' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.unique' => 'Vous avez déjà laissé un avis pour ce produit.',
            'note.min' => 'La note doit être comprise entre 1 et 5.',
            'note.max' => 'La note doit être comprise entre 1 et 5.',
        ];
    }
}
