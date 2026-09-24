<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Cooperative;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => $name,
            'slug' => Product::uniqueSlug($name),
            'description' => fake()->paragraph(),
            'prix' => fake()->randomFloat(2, 40, 250),
            'prix_remise' => null,
            'stock' => 20,
            'coop_id' => Cooperative::factory(),
            'cat_id' => Category::factory(),
        ];
    }
}
