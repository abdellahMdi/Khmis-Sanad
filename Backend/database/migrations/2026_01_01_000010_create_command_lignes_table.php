<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('command_lignes', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('quantity');
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->integer('command_id');
            $table->integer('product_id');

            $table->foreign('command_id', 'fk_command_lignes_command')
                ->references('id')->on('commands')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('product_id', 'fk_command_lignes_product')
                ->references('id')->on('products')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->index('command_id', 'idx_command_lignes_command_id');
            $table->index('product_id', 'idx_command_lignes_product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_lignes');
    }
};
