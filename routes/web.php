<?php


use Illuminate\Support\Facades\Route;

Route::any("/spa/{any?}",function () {
    return view("welcome");
})->where('any', '.*');

Route::redirect('/', '/spa/');

