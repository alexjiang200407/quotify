<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Artisan::command('quote:update-daily', function () {
    DB::statement('CALL update_daily_quote()');
})->purpose('Update the daily quote using the stored procedure');

Schedule::command("quote:update-daily")->dailyAt("23:59");
