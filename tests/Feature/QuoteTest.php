<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class QuoteTest extends TestCase
{
    use DatabaseTransactions;

    public function test_quote_of_the_day(): void
    {
        // TODO Check json data
        $response = $this->get('/api/quotes/daily');
        $response->assertOk();
    }

    public function test_get_quote_without_quote_id(): void
    {
        $response = $this->get('/api/quotes/get');
        $response->assertBadRequest();
    }

    public function test_get_quote_with_invalid_quote_id(): void
    {
        $response = $this->get('/api/quotes/get?quoteID=asd');
        $response->assertBadRequest();
    }

    public function test_get_quote_success(): void
    {
        // TODO Ensure quote exists
        $response = $this->get('/api/quotes/get?quoteID=5');
        // TODO Check json response
        $response->assertOk();
    }

    // TODO Check doesn't exist
    // public function test_get_quote_does_not_exist(): void
    // {
    //     $response = $this->get('/api/quotes/get?quoteID=100000');
    //     $response->assertBadRequest();
    // }


    public function test_like_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/like', ["quoteID" => "asd"], $this->make_auth_request_header("asd"));
        $response->assertUnauthorized();
    }

    public function test_like_quote_quote_id_invalid(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/like', ["quoteID" => "asd"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    // TODO Check ID doesn't exist
    // public function test_like_quote_quote_id_doesnt_exist(): void
    // {
    //     $token = $this->make_user_helper();
    //     $response = $this->post('/api/quotes/like', ["quoteID" => "1"], $this->make_auth_request_header($token));
    //     $response->assertBadRequest();
    // }

    public function test_save_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/save', ["quoteID" => "asd"], $this->make_auth_request_header("asd"));
        $response->assertUnauthorized();
    }

    // TODO Check ID doesn't exist
    // public function test_save_quote_quote_id_doesnt_exist(): void
    // {
    //     $token = $this->make_user_helper();
    //     $response = $this->post('/api/quotes/save', ["quoteID" => "1"], $this->make_auth_request_header($token));
    //     $response->assertBadRequest();
    // }
}