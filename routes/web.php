<?php

use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("api/quotes")->controller(QuoteController::class)->group(function () {
    Route::get("/daily", "getDaily");
    Route::get("/get", "getQuote");
    Route::post("/like", "likeQuote");
    Route::post("/unlike", "unlikeQuote");
    Route::post("/save", "saveQuote");
    Route::post("/unsave", "unsaveQuote");
});

Route::prefix("api/user")->controller(UserController::class)->group(function () {
    Route::get("/{userID}/saved", "getSaved");
    Route::get("/{userID}/upvoted", "getUpvoted");
    Route::post("/register", action: "registerUser");
    Route::post("/auth", "authUser");
    Route::post("/token", "token");
});

// Route::prefix("api/search")->controller(SearchController::class)->group(function () {
//     Route::get("/saved", "getSaved");
// });

Route::fallback(function () {
    return view("welcome");
});
