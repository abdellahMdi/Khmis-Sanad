<?php

namespace Database\Factories;

use App\Models\Cooperative;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Cooperative> */
class CooperativeFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'name' => substr($name, 0, 50),
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'bio' => fake()->paragraph(),
            'hq_location' => fake()->city().', Maroc',
            'status' => Cooperative::STATUS_APPROVED,
            'user_id' => User::factory()->artisan(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => Cooperative::STATUS_PENDING]);
    }

    public function blocked(): static
    {
        return $this->state(fn () => ['status' => Cooperative::STATUS_BLOCKED]);
    }
}
