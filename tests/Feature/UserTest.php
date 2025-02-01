<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
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

    public function test_get_user_data_forbidden(): void
    {
        $response = $this->get("/api/user", headers: [
            "Authorization" => "Bearer abcdefg", "Accept" => "application/json"
        ]);

        $response->assertUnauthorized();
    }

    public function test_get_user_data(): void
    {
        $token = $this->make_user_helper("abcde@gmail.com", "username");
        $response = $this->get("/api/user", headers: [
            "Authorization" => "Bearer $token", "Accept" => "application/json"
        ]);

        // TODO Check all other fields
        // {
        //     "id": 48,
        //     "name": "username",
        //     "email": "email@gmail.com",
        //     "email_verified_at": null,
        //     "created_at": "2025-01-30T10:11:26.000000Z",
        //     "updated_at": "2025-01-30T10:11:26.000000Z"
        // }

        $response->assertOk();

        $response->assertJsonFragment([
            "name" => "username",
            "email" => "abcde@gmail.com",
        ]);
    }

    public function test_multiple_user_data(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $response = $this->actingAs($user1)->get('api/user');
        $json1 = $response->json();
        $response = $this->actingAs($user2)->get('api/user');
        $this->assertNotEquals($response->json(), $json1);
    }



    public function test_user_login_success(): void
    {
        $token = $this->make_user_helper("abcde@gmail.com", password: "secret1234");

        $response = $this->post("/api/login", [
            "email" => "abcde@gmail.com", "password" => "secret1234"
        ]);

        $response->assertOk();
        $response->assertJsonIsObject();
        $response->assertJsonStructure([
            "token"
        ]);
        $token = $response->json("token");
        $response = $this->get("/api/user", headers: $this->make_auth_request_header($token));

        $response->assertOk();
    }


    public function test_user_login_failure(): void
    {
        $token = $this->make_user_helper("abcde@gmail.com", password: "secret1234");

        $response = $this->post("/api/login", [
            "email" => "abcde@gmail.com", "password" => "secret12345"
        ]);

        $response->assertUnauthorized();
    }


    public function test_user_get_saved(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get("/api/user/saved", headers: $this->make_auth_request_header($token));
        
        // TODO Check saved format
        $response->assertOk();
    }

    public function test_user_get_saved_unauthorized(): void
    {
        $response = $this->get("/api/user/saved", headers: $this->make_auth_request_header("abcd"));
        $response->assertUnauthorized();
    }

    public function test_user_get_liked(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get("/api/user/upvoted", headers: $this->make_auth_request_header($token));
        
        // TODO Check liked format
        $response->assertOk();
    }

    public function test_user_get_liked_unauthorized(): void
    {
        $response = $this->get("/api/user/upvoted", headers: $this->make_auth_request_header("abcd"));
        $response->assertUnauthorized();
    }
}