<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_img', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('url', 255);
            $table->integer('order')->nullable();
            $table->integer('product_id');

            $table->foreign('product_id', 'fk_product_img_product')
                ->references('id')->on('products')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->index('product_id', 'idx_product_img_product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_img');
    }
};
