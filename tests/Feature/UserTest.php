<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    public function test_user_register_success(): void
    {
        $this->make_user_helper();
    }

    public function test_user_register_duplicate(): void
    {
        $this->make_user_helper("abcde@gmail.com");
        $response = $this->post("/api/user/register", [
            "username" => "12345",
            "password" => "12345678",
            "email" => "abcde@gmail.com"
        ]);

        $response->assertBadRequest();
    }
}