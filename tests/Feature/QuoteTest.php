<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteTest extends TestCase
{
    /**
     * A basic test example.
     */
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

}