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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('purchase_request_id');
            $table->boolean('purchased')->default(0);
            $table->boolean('received')->default(0);
            $table->tinyText('name');
            $table->float('price');
            $table->float('delivery_cost')->nullable();
            $table->text('description');
            $table->text('reason');
            $table->string('image')->nullable();
            $table->integer('quantity')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchases');
    }
};
