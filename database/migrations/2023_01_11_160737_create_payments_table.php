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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('amount', $precision = 8, $scale = 2);
            $table->boolean('incoming')->default(0);
            $table->string('name');
            $table->tinyText('description')->nullable();
            $table->date('payment_date');
            $table->foreignId('account_id');
            $table->foreignId('treasury_report_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
};
