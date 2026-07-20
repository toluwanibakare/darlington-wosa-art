<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('settings')->insert([
            ['key' => 'referral_reward_points', 'value' => '100'],
            ['key' => 'referral_reward_cash', 'value' => '100'],
            ['key' => 'min_withdrawal', 'value' => '5000'],
            ['key' => 'telegram_link', 'value' => 'https://t.me/darlingtonwosa_art'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
