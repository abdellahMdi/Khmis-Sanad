<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panier_items', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('quantite')->default(1);
            $table->integer('panier_id');
            $table->integer('product_id');

            $table->foreign('panier_id', 'fk_panier_items_panier')
                ->references('id')->on('paniers')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('product_id', 'fk_panier_items_product')
                ->references('id')->on('products')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->index('panier_id', 'idx_panier_items_panier_id');
            $table->index('product_id', 'idx_panier_items_product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panier_items');
    }
};
