<?php

namespace App\Http\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * Return all categories (small enough to skip pagination).
     */
    public function all(): Collection
    {
        return Category::orderBy('name')->get();
    }

    /**
     * Create a new category.
     */
    public function create(string $name): Category
    {
        return Category::create(['name' => $name]);
    }

    /**
     * Rename an existing category.
     */
    public function rename(Category $category, string $name): Category
    {
        $category->update(['name' => $name]);
        return $category->fresh();
    }

    /**
     * Delete a category (guards against categories in use are handled by DB FK).
     */
    public function delete(Category $category): void
    {
        abort_if(
            $category->products()->exists(),
            409,
            'Cannot delete a category that still has products.'  
        );

        $category->delete();
    }
}
