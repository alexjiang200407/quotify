<?php

namespace App\Http\Controllers;

use Dotenv\Exception\ValidationException;
use Exception;
use \Illuminate\Http\Request;

class QuoteController extends Controller
{
    function getQuote(Request $request) {
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Get quote with ID {$data["quoteID"]}";
    }

    function getDaily() {
        return "Daily Quote";
    }

    function likeQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Liking quote with {$data["quoteID"]}";
    }

    function unlikeQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Unliking quote with {$data["quoteID"]}";
    }

    function saveQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Saving quote with {$data["quoteID"]}";
    }

    function unsaveQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Unsaving quote with {$data["quoteID"]}";
    }
}