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
            $table->tinyText('component');
            $table->decimal('cost', $precision = 8, $scale = 2);
            $table->integer('priority');
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
