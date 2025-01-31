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
        $data = $response->json();

        // Validate the main quote structure
        $this->assertArrayHasKey('id', $data);
        $this->assertIsInt($data['id']);
        
        $this->assertArrayHasKey('created_at', $data);
        $this->assertIsString($data['created_at']);
        
        $this->assertArrayHasKey('updated_at', $data);
        $this->assertIsString($data['updated_at']);
        
        $this->assertArrayHasKey('quote', $data);
        $this->assertIsString($data['quote']);
        
        $this->assertArrayHasKey('upvotes', $data);
        $this->assertIsInt($data['upvotes']);
        
        $this->assertArrayHasKey('saves', $data);
        $this->assertIsInt($data['saves']);
        
        $this->assertArrayHasKey('author_id', $data);
        $this->assertIsInt($data['author_id']);
        
        // Validate the author structure
        $this->assertArrayHasKey('author', $data);
        $this->assertIsArray($data['author']);
        
        $author = $data['author'];
        
        $this->assertArrayHasKey('id', $author);
        $this->assertIsInt($author['id']);
        
        $this->assertArrayHasKey('created_at', $author);
        $this->assertIsString($author['created_at']);
        
        $this->assertArrayHasKey('updated_at', $author);
        $this->assertIsString($author['updated_at']);
        
        $this->assertArrayHasKey('full_name', $author);
        $this->assertIsString($author['full_name']);
        
        $this->assertArrayHasKey('description', $author);
        $this->assertIsString($author['description']);
        
        $this->assertArrayHasKey('wiki_page', $author);
        $this->assertIsString($author['wiki_page']);
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