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
        Schema::create('daily_quote', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId("quote_id");
            
            $table->foreign("quote_id")
                ->references("id")
                ->on("quotes")
                ->onDelete("CASCADE");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_quote');
    }
};
