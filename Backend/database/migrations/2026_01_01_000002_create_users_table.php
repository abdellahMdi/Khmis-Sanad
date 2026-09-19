<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('firstname', 50);
            $table->string('lastname', 50);
            $table->string('email', 150)->unique();
            $table->string('mot_de_passe', 255);
            $table->string('telephone', 50)->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->integer('role_id');

            $table->foreign('role_id', 'fk_users_role')
                ->references('id')->on('roles')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->index('role_id', 'idx_users_role_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
