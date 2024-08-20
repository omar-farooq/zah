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
        Schema::create('account_treasury_report', function (Blueprint $table) {
            $table->foreignId('treasury_report_id');
            $table->foreignId('account_id');
            $table->decimal('account_balance',10,3);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('account_treasury_report');
    }
};
