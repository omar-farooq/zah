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
        Schema::create('treasury_reports', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->text('comments')->nullable();
            $table->decimal('calculated_remaining_budget', $precision = 10, $scale = 2);
            $table->decimal('remaining_budget', $precision = 10, $scale = 2);
            $table->boolean('submitted')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('treasury_reports');
    }
};
