<?php

use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("/quotes")->controller(QuoteController::class)->group(function () {
    Route::get("/daily", "getDaily");
    Route::get("/get", "getQuote");
    
    Route::post("/like", "likeQuote")->middleware('auth:sanctum');
    Route::post("/unlike", "unlikeQuote")->middleware('auth:sanctum');
    Route::post("/save", "saveQuote")->middleware('auth:sanctum');
    Route::post("/unsave", "unsaveQuote")->middleware('auth:sanctum');
});

Route::prefix("/user")->controller(UserController::class)->group(function () {
    Route::get("/{userID}/saved", "getSaved")->middleware('auth:sanctum');
    Route::get("/{userID}/upvoted", "getUpvoted")->middleware('auth:sanctum');
    Route::post("/register", action: "registerUser");
    Route::post("/auth", "authUser");
    Route::post("/token", "token");
});


Route::prefix("/search")->controller(SearchController::class)->group(function () {
    Route::get("/saved", "getSaved");
});

