<?php


use Illuminate\Support\Facades\Route;

Route::any("/spa/{any?}",function () {
    return view("welcome");
})->where('any', '.*');

Route::redirect('/', '/spa/');

Route::get( '/some_url', function () {
    return response()->json(["error" => "Token is wrong"]);
})->name('login');