<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 255);
            $table->string('slug', 255)->nullable()->unique();
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_remise', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->integer('coop_id');
            $table->integer('cat_id');

            $table->foreign('coop_id', 'fk_products_coop')
                ->references('id')->on('cooperatives')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('cat_id', 'fk_products_category')
                ->references('id')->on('categories')
                ->onUpdate('cascade')->onDelete('restrict');
            $table->index('coop_id', 'idx_products_coop_id');
            $table->index('cat_id', 'idx_products_cat_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
