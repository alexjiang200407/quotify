<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('signatures', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('type')->unique();
            $table->unsignedInteger('font_size')->default(30);
            $table->unsignedInteger('stroke_width')->default(1);
            $table->unsignedInteger('duration')->default(2000);
            $table->string('color')->default('black');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signatures');
    }
};
