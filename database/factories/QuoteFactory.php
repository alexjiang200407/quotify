<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Quote;
use App\Models\Tag;
use App\Models\User;
use DB;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quote>
 */
class QuoteFactory extends Factory
{
    /**
     * Define the model"s default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $upvotes = $this->faker->numberBetween(0, min(10, User::count()));
        $saves = $this->faker->numberBetween(0, min(10, User::count()));
        return [
            "quote" => $this->faker->sentences(asText: true),
            "upvotes" => $upvotes,
            "saves" => $saves,
            "author_id" => Author::inRandomOrder()->first()
        ];
    }


    public function configure()
    {
        return $this->afterCreating(function (Quote $quote) {
            $tags = Tag::inRandomOrder()->take(rand(0, min(3, Tag::count())))->pluck("id");
            foreach ($tags as $tag) {
                DB::table("quote_tags")->insert([
                    "quote_id" => $quote->id,
                    "tag_id" => $tag,
                ]);
            }

            $userLikes = User::inRandomOrder()->take($quote->getAttribute("upvotes"))->pluck("id");
            $userSaves = User::inRandomOrder()->take($quote->getAttribute("saves"))->pluck("id");

            foreach ($userLikes as $userID) {
                DB::table("quote_likes")->insert([
                    "quote_id" => $quote->id,
                    "user_id" => $userID,
                ]);
            }

            foreach ($userSaves as $userID) {
                DB::table("quote_saves")->insert([
                    "quote_id" => $quote->id,
                    "user_id" => $userID,
                ]);
            }

        });
    }
}
