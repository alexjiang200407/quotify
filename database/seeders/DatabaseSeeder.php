<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Quote;
use App\Models\Tag;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Author::factory(10)->create();
        Tag::factory(10)->create();
        Quote::factory(100)->create();

        User::create(["name" => "test", "password" => "password", "email" => "test@gmail.com"]);
    }
}
