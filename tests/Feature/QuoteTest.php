<?php

namespace Tests\Feature;

use Illuminate\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class QuoteTest extends TestCase
{
    use DatabaseTransactions;

    private function valid_quote_response(TestResponse $response): void {
        $response->assertJsonIsObject();

        $response->assertJsonStructure([
            'id',
            'quote',
            'upvotes',
            'saves',
            'author' => [
                'id',
                'full_name',
                'description',
                'wiki_page'
            ],
            'tags' => [
                '*' => [
                    'id',
                    'label'
                ]
            ]
        ]);
    }

    public function test_quote_of_the_day(): void
    {
        $response = $this->get('/api/quotes/daily');
        $response->assertOk();
        $this->valid_quote_response($response);
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
        $response = $this->get('/api/quotes/daily');
        $exp = $response->json();
        $response->assertOk();
        $id = $response->json('id');
        $response = $this->get("/api/quotes/get?quoteID=$id");
        $response->assertJsonFragment($exp);
    }

    public function test_get_quote_does_not_exist(): void
    {
        $response = $this->get('/api/quotes/get?quoteID=100000');
        $response->assertBadRequest();
    }

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

    public function test_like_quote_quote_id_doesnt_exist(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/like', ["quoteID" => "10000000000"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_like_quote_success(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $likes = $response->json('upvotes');
        $response->assertOk();
        $response = $this->post('/api/quotes/like', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($likes + 1, $response->json('upvotes'));
        $response->assertOk();
    }
    
    public function test_like_quote_already_liked(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $likes = $response->json('upvotes');
        $response->assertOk();
        $response = $this->post('/api/quotes/like', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->post('/api/quotes/like', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertBadRequest();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($likes + 1, $response->json('upvotes'));
        $response->assertOk();
    }

    public function test_unlike_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/unlike', ["quoteID" => "asd"], $this->make_auth_request_header("asd"));
        $response->assertUnauthorized();
    }

    public function test_unlike_quote_quote_id_invalid(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/unlike', ["quoteID" => "asd"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_unlike_quote_quote_id_doesnt_exist(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/unlike', ["quoteID" => "10000000000"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_unlike_quote_success(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $likes = $response->json('upvotes');
        $response->assertOk();
        $response = $this->post('/api/quotes/like', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->post('/api/quotes/unlike', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($likes, $response->json('upvotes'));
        $response->assertOk();
    }
    
    public function test_unlike_quote_not_liked(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $likes = $response->json('upvotes');
        $response->assertOk();
        $response = $this->post('/api/quotes/unlike', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertBadRequest();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($likes, $response->json('upvotes'));
        $response->assertOk();
    }

    public function test_save_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/save', ["quoteID" => "asd"], $this->make_auth_request_header("asd"));
        $response->assertUnauthorized();
    }

    public function test_save_quote_quote_id_invalid(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/save', ["quoteID" => "asd"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_save_quote_quote_id_doesnt_exist(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/save', ["quoteID" => "10000000000"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_save_quote_success(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $saves = $response->json('saves');
        $response->assertOk();
        $response = $this->post('/api/quotes/save', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($saves + 1, $response->json('saves'));
        $response->assertOk();
    }
    
    public function test_save_quote_already_saved(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $saves = $response->json('saves');
        $response->assertOk();
        $response = $this->post('/api/quotes/save', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->post('/api/quotes/save', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertBadRequest();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($saves + 1, $response->json('saves'));
        $response->assertOk();
    }

    public function test_unsave_quote_unauthorized(): void
    {
        $response = $this->post('/api/quotes/unsave', ["quoteID" => "asd"], $this->make_auth_request_header("asd"));
        $response->assertUnauthorized();
    }

    public function test_unsave_quote_quote_id_invalid(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/unsave', ["quoteID" => "asd"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_unsave_quote_quote_id_doesnt_exist(): void
    {
        $token = $this->make_user_helper();
        $response = $this->post('/api/quotes/unsave', ["quoteID" => "10000000000"], $this->make_auth_request_header($token));
        $response->assertBadRequest();
    }

    public function test_unsave_quote_success(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $saves = $response->json('saves');
        $response->assertOk();
        $response = $this->post('/api/quotes/save', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->post('/api/quotes/unsave', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertOk();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($saves, $response->json('saves'));
        $response->assertOk();
    }
    
    public function test_unsave_quote_not_saved(): void
    {
        $token = $this->make_user_helper();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $saves = $response->json('saves');
        $response->assertOk();
        $response = $this->post('/api/quotes/unsave', ["quoteID" => 1], $this->make_auth_request_header($token));
        $response->assertBadRequest();
        $response = $this->get('/api/quotes/get?quoteID=1', $this->make_auth_request_header($token));
        $this->assertEquals($saves, $response->json('saves'));
        $response->assertOk();
    }
}