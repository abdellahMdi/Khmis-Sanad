<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('command_lignes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('quantity');
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->unsignedInteger('command_id');
            $table->unsignedInteger('product_id');

            $table->foreign('command_id')->references('id')->on('commands')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('command_lignes');
    }
};