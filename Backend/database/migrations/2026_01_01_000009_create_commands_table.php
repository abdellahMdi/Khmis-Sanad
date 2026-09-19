<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commands', function (Blueprint $table) {
            $table->integer('id', true);
            $table->decimal('total', 10, 2);
            $table->string('statut', 50)->default('pending');
            $table->string('adresse_livraison', 255)->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->integer('user_id')->nullable();

            $table->foreign('user_id', 'fk_commands_user')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('set null');
            $table->index('user_id', 'idx_commands_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commands');
    }
};
