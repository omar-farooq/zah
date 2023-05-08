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
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('rule');
            $table->decimal('rule_number', $precision = 10, $scale = 2);
            $table->softDeletes($column = 'deleted_at', $precision = 0);
            $table->string('approval_status')->default('in voting');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rules');
    }
};