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
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->tinyText('name');	
            $table->float('price');
            $table->float('delivery_cost')->nullable();
            $table->text('description');
            $table->text('reason');
            $table->text('url')->nullable();
            $table->string('image')->nullable();
            $table->integer('quantity')->default(1);
            $table->foreignId('user_id');
            $table->string('approval_status')->default('in voting');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_requests');
    }
};
