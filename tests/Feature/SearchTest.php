<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use DatabaseTransactions;

    public function test_user_search_success(): void
    {
        $response = $this->get('/api/search/quotes?tags[]=1');
        $response->assertOk();
        Sanctum::actingAs(User::factory()->create(), ['*'], 'api');
        $response = $this->get('/api/search/auth/quotes?tags[]=1');
        $response->assertOk();
    }

}