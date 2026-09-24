<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<User> */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'mot_de_passe' => 'Password123',
            'telephone' => '06'.fake()->numerify('########'),
            'role_id' => Role::query()->where('label', 'client')->value('id') ?? Role::factory(),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => [
            'role_id' => Role::query()->where('label', 'admin')->value('id'),
        ]);
    }

    public function artisan(): static
    {
        return $this->state(fn () => [
            'role_id' => Role::query()->where('label', 'artisan')->value('id'),
        ]);
    }

    public function client(): static
    {
        return $this->state(fn () => [
            'role_id' => Role::query()->where('label', 'client')->value('id'),
        ]);
    }
}
