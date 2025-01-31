<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use DB;
use Exception;
use \Illuminate\Http\Request;

class QuoteController extends Controller
{
    function getQuote(Request $request) {
        $data = $this->validateRequest($request, ["quoteID" => "required|integer"]);
        return "Get quote with ID {$data["quoteID"]}";
    }

    function getDaily() {
        $daily = DB::select("SELECT quote_id from daily_quote");
        
        if (!$daily || !property_exists($daily[0], 'quote_id')) {
            return response()->json(["error" => "No daily quote"], 500);
        }

        $quote = Quote::where("quotes.id", "=", $daily[0]->quote_id)
            ->with(['author', 'tags'])
            ->get();

        return response()->json($quote[0]);
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