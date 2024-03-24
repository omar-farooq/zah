<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('treasury_plans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('expected_incoming', $precision = 8, $scale = 2);
            $table->decimal('expected_outgoing', $precision = 8, $scale = 2);
            $table->decimal('available_balance', $precision = 8, $scale = 2);
            $table->decimal('expected_balance', $precision = 8, $scale = 2);
            $table->decimal('estimated_remaining_balance', $precision = 8, $scale = 2);
            $table->foreignId('user_id');
            $table->string('plan_length');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('treasury_plans');
    }
};
