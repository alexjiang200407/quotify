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
        Schema::create('quote_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId("quote_id");
            $table->foreignId("tag_id");
            
            $table->foreign("quote_id")
                ->references("id")
                ->on("quotes")
                ->onDelete("CASCADE");
            
            $table->foreign("tag_id")
                ->references("id")
                ->on("tags")
                ->onDelete("CASCADE");

            $table->unique(["quote_id", "tag_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("quote_tags");
    }
};
