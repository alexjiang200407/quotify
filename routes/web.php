<?php


use Illuminate\Support\Facades\Route;

Route::get("/spa/",function () {
    return view("welcome");
});;

Route::redirect('/', '/spa/');

