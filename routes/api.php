<?php

use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post("login", [UserController::class, "login"]); //->middleware('guest:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::post("/quotes/like", [QuoteController::class, "likeQuote"]);
    Route::post("/quotes/unlike", [QuoteController::class, "unlikeQuote"]);
    Route::post("/quotes/save", [QuoteController::class, "saveQuote"]);
    Route::post("/quotes/unsave", [QuoteController::class, "unsaveQuote"]);
    Route::get("/user/saved", [UserController::class, "getSaved"]);
    Route::get("/user/upvoted", [UserController::class, "getUpvoted"]);
    Route::post("/logout", [UserController::class, "logout"]);
    Route::get("/user", [UserController::class, "getUser"]);
});

Route::get("/quotes/daily", [QuoteController::class, "getDaily"]);
Route::get("/quotes/get", [QuoteController::class, "getQuote"]);
Route::post("/user/register", [UserController::class, "registerUser"]);


Route::get("/search", [SearchController::class, "search"]);

