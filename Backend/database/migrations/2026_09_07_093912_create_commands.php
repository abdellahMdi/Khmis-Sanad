<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commands', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('total', 10, 2);
            $table->string('statut', 50)->nullable();
            $table->string('adresse_livraison', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commands');
    }
};