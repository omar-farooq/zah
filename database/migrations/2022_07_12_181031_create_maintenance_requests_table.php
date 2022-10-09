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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->timestamp('start');
            $table->timestamp('finish');
            $table->decimal('cost', $precision = 8, $scale = 2);
            $table->text('required_maintenance');
            $table->text('reason');
            $table->string('contractor');
            $table->string('type');
            $table->foreignId('user_id');
            $table->boolean('emergency');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
