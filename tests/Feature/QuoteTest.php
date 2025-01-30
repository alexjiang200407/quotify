<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class QuoteTest extends TestCase
{
    use DatabaseTransactions;

    public function test_quote_of_the_day(): void
    {
        $response = $this->get('/api/quote/daily');
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

    public function test_like_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/like', ["quoteID" => "asd"]);
        $response->assertUnauthorized();
    }

    public function test_like_quote_quote_id_invalid(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/like', ["quoteID" => "asd"], ["token" => $token]);
        $response->assertBadRequest();
    }
}