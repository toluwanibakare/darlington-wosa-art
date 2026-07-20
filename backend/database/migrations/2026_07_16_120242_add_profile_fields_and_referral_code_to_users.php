<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code', 20)->unique()->nullable()->after('avatar');
            $table->date('date_of_birth')->nullable()->after('referral_code');
            $table->string('address')->nullable()->after('date_of_birth');
            $table->string('city')->nullable()->after('address');
            $table->string('country')->nullable()->after('city');
            $table->text('bio')->nullable()->after('country');
            $table->decimal('wallet_balance', 10, 2)->default(0)->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['referral_code', 'date_of_birth', 'address', 'city', 'country', 'bio', 'wallet_balance']);
        });
    }
};
