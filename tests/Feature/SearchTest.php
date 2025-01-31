<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use DatabaseTransactions;

    public function test_user_search_success(): void
    {
        $response = $this->get('/api/search');
        // TODO Check search response with different query params
        $response->assertOk();
    }

}