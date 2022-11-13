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
            $table->time('start_time');
            $table->time('finish_time');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('cost', $precision = 8, $scale = 2);
            $table->text('required_maintenance');
            $table->text('reason');
            $table->string('contractor');
            $table->string('contractor_phone')->nullable();
            $table->string('contractor_email')->nullable();
            $table->string('type');
            $table->foreignId('user_id');
            $table->boolean('emergency')->default(0);
            $table->boolean('approved')->default(0);
            $table->boolean('rejected')->default(0);
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
