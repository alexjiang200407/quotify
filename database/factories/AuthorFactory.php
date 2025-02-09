<?php

namespace Database\Factories;

use App\Models\Signature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Author>
 */
class AuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "full_name" => $this->faker->unique()->name,
            "description" => $this->faker->sentences(asText: true),
            "wiki_page" => $this->faker->url,
            "signature_id" => Signature::inRandomOrder()->first()
        ];
    }
}
