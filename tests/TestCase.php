<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function make_user_helper(string $email = "testingabcassd@gmail.com", string $username = "abcde", string $password = "password"): string {
        $response = $this->post("/api/user/register", [
            "username" => $username,
            "password" => $password,
            "email" => $email
        ]);
        $response->assertOk();
        
        $response = $this->post("/api/login", [
            "email" => $email,
            "password" => $password,
        ]);
        $response->assertOk();

        $response->assertJsonIsObject();
        $response->assertJsonStructure([
            "token"
        ]);
        $token = $response->json("token");
        $this->assertTrue(is_string($token), "Token is not a string");

        return $token;
    }

    protected function make_auth_request_header(string $token): array {
        return [
            "Authorization" => "Bearer $token",
            "Accept" => "application/json",
            "access-control-allow-origin" => "*",
            "cache-control" => "no-cache, private",
        ];
    }

}
