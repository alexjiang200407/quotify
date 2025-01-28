<?php

use Illuminate\Support\Facades\Route;

Route::get('/api', function () {
});

Route::fallback(function () {
    return view('welcome');
});
