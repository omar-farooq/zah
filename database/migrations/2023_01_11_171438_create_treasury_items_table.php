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
        Schema::create('treasury_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->morphs('treasurable');
            $table->decimal('amount', $prevision = 8, $scale = 2);
            $table->boolean('is_incoming')->default(0);
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
        Schema::dropIfExists('treasury_items');
    }
};
