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
        Schema::create('quote_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId("quote_id");
            $table->foreignId("user_id");

            $table->foreign("quote_id")
                ->references("id")
                ->on("quotes")
                ->onDelete("CASCADE");
            
            $table->foreign("user_id")
                ->references("id")
                ->on("users")
                ->onDelete("CASCADE");

            $table->unique(["quote_id", "user_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("quote_likes");
    }
};
