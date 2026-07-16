<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('type')->default('image');
            $table->string('src');
            $table->string('thumb')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->text('description')->nullable();
            $table->string('client')->nullable();
            $table->string('year')->nullable();
            $table->string('medium')->nullable();
            $table->string('video_src')->nullable();
            $table->string('video_embed')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
