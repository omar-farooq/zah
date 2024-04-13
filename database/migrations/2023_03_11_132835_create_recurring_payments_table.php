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
        Schema::create('recurring_payments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('recipient');
            $table->string('description')->nullable();
            $table->string('frequency');
            $table->integer('day_of_week_due')->nullable();
            $table->integer('day_of_month_due')->nullable();
            $table->integer('month_due')->nullable();
            $table->decimal('amount', $precision = 8, $scale = 2)->nullable();
            $table->softDeletes($column = 'deleted_at', $precision = 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recurring_payments');
    }
};
