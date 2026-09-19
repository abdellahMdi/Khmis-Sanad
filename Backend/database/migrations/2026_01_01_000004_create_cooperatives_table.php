<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 50)->unique();
            $table->string('slug', 255)->unique();
            $table->text('bio')->nullable();
            $table->string('hq_location', 255)->nullable();
            $table->string('status', 50)->default('pending');
            $table->string('proof_path', 255)->nullable();
            $table->integer('user_id')->unique();

            $table->foreign('user_id', 'fk_cooperatives_user')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cooperatives');
    }
};
