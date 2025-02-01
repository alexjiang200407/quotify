<?php


use Illuminate\Support\Facades\Route;

Route::get("/spa/{any}",function () {
    return view("welcome");
});;

Route::redirect('/', '/spa/');
