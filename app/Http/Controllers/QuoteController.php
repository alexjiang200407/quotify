<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use DB;
use Illuminate\Database\QueryException;
use \Illuminate\Http\Request;

class QuoteController extends Controller
{
    function getQuote(Request $request) {
        $data = $this->validateRequest($request, ["quoteID" => "required|numeric"]);

        $quote = Quote::where("quotes.id", "=", $data["quoteID"])
            ->with(['author', 'tags'])
            ->withCount(['likes as upvotes', 'saves as saves'])
            ->get();

        if ($quote->isEmpty()) {
            return response()->json(["error" => "No quote exists with id {$data["quoteID"]}"], 400);
        }

        return response()->json($quote[0]);
    }

    function getDaily() {
        $daily = DB::select("SELECT quote_id from daily_quote");
        
        if (!$daily || !property_exists($daily[0], 'quote_id')) {
            return response()->json(["error" => "No daily quote"], 500);
        }

        $quote = Quote::where("quotes.id", "=", $daily[0]->quote_id)
            ->with(['author', 'tags'])
            ->withCount(['likes as upvotes', 'saves as saves'])
            ->get();

        return response()->json($quote[0]);
    }

    function getDailyAuth(Request $request) {
        $daily = DB::select("SELECT quote_id from daily_quote");
        
        if (!$daily || !property_exists($daily[0], 'quote_id')) {
            return response()->json(["error" => "No daily quote"], 500);
        }
        $user = $this->getUser($request)->id;

        $quote1 = Quote::selectRaw("
                quotes.*,
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM quote_likes 
                        WHERE quote_likes.quote_id = quotes.id AND quote_likes.user_id = $user
                    ) THEN TRUE
                    ELSE FALSE
                END AS user_upvoted,
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM quote_saves 
                        WHERE quote_saves.quote_id = quotes.id AND quote_saves.user_id = $user
                    ) THEN TRUE
                    ELSE FALSE
                END AS user_saved
            ")
            ->where("quotes.id", "=", $daily[0]->quote_id)
            ->with(['author', 'tags'])
            ->withCount(['likes as upvotes', 'saves as saves'])
            ->get();

        return response()->json($quote1[0]);
    }

    function likeQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|numeric"]);

        try {
            
            $quote = Quote::find($data["quoteID"]);

            if (!$quote) {
                return response()->json(['error' => "Quote with id {$data["quoteID"]} not found"], 400);
            }

            $quote->likes()
                ->attach($user->id);

        } catch (QueryException $e) {

            $msg = $e->getMessage();
            if ($e->getCode() == 23000) {
                $msg = "Quote has already been liked";
            }

            return response()->json(["error" => $msg], 400);
        
        }
    }

    function unlikeQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|numeric"]);

        try {
            
            $quote = Quote::find($data["quoteID"]);

            if (!$quote) {
                return response()->json(['error' => "Quote with id {$data["quoteID"]} not found"], 400);
            }

            $likes = $quote->likes();

            if (!$likes->where('user_id', $user->id)->exists()) {
                return response()->json(["error" => "Cannot unlike a quote you haven't liked"], 400);
            }

            $likes->detach($user->id);

        } catch (QueryException $e) {

            return response()->json(["error" => $e->getMessage()], 400);

        }
    }

    function saveQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|numeric"]);

        try {
            
            $quote = Quote::find($data["quoteID"]);

            if (!$quote) {
                return response()->json(['error' => "Quote with id {$data["quoteID"]} not found"], 400);
            }

            $quote->saves()
                ->attach($user->id);

        } catch (QueryException $e) {

            $msg = $e->getMessage();
            if ($e->getCode() == 23000) {
                $msg = "Quote has already been saved";
            }

            return response()->json(["error" => $msg], 400);
        
        }

    }

    function unsaveQuote(Request $request) {
        $user = $this->getUser($request);
        $data = $this->validateRequest($request, ["quoteID" => "required|numeric"]);

        try {
            
            $quote = Quote::find($data["quoteID"]);

            if (!$quote) {
                return response()->json(['error' => "Quote with id {$data["quoteID"]} not found"], 400);
            }

            $saves = $quote->saves();

            if (!$saves->where('user_id', $user->id)->exists()) {
                return response()->json(["error" => "Cannot unsave a quote you haven't saved"], 400);
            }

            $saves->detach($user->id);

        } catch (QueryException $e) {

            return response()->json(["error" => $e->getMessage()], 400);

        }
    }
}