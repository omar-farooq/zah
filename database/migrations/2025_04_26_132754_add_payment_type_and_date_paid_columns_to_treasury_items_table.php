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
        Schema::table('treasury_items', function (Blueprint $table) {
            $table->string('payment_type')->nullable();
            $table->date('date_paid')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treasury_items', function (Blueprint $table) {
            $table->dropColumn(['payment_type', 'date_paid']);
        });
    }
};
