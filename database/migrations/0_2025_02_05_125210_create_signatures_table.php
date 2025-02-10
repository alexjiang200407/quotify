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
            $table->integer('font_size')->default(30);
            $table->float('stroke_width')->default(1.2);
            $table->integer('letter_spacing')->default(0);
            $table->integer('duration')->default(225);
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
