<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rule_deletes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('rule_id');
            $table->string('approval_status')->default('in voting');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rule_deletes');
    }
};
