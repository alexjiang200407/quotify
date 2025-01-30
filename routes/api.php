<?php

use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("login", [UserController::class, "login"])->middleware("guest:sanctum");

Route::prefix("/quotes")->controller(QuoteController::class)->group(function () {
    Route::get("/daily", "getDaily");
    Route::get("/get", "getQuote");
    
    Route::post("/like", "likeQuote")->middleware('auth:sanctum');
    Route::post("/unlike", "unlikeQuote")->middleware('auth:sanctum');
    Route::post("/save", "saveQuote")->middleware('auth:sanctum');
    Route::post("/unsave", "unsaveQuote")->middleware('auth:sanctum');
});

Route::prefix("/user")->controller(UserController::class)->group(function () {

    Route::get("/", function (Request $request) {
        return $request->user();
    })->middleware("auth:sanctum");

    Route::get("/saved", "getSaved")->middleware('auth:sanctum')->middleware("auth:sanctum");
    Route::get("/upvoted", "getUpvoted")->middleware('auth:sanctum')->middleware("auth:sanctum");
    Route::post("/register", action: "registerUser");
});


Route::get("/search", [SearchController::class, "search"]);

