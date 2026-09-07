<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
        });

        Schema::create('cooperatives', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50)->unique();
            $table->string('slug', 255)->unique();
            $table->text('bio')->nullable();
            $table->string('hq_location', 255);
            $table->string('status', 50)->nullable();
            $table->unsignedInteger('user_id')->unique();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_remise', 10, 2)->nullable();
            $table->integer('stock');
            $table->unsignedInteger('coop_id');
            $table->unsignedInteger('cat_id');

            $table->foreign('coop_id')->references('id')->on('cooperatives')->onDelete('cascade');
            $table->foreign('cat_id')->references('id')->on('categories')->onDelete('cascade');
        });

        Schema::create('product_img', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url', 255);
            $table->integer('order')->nullable();
            $table->unsignedInteger('product_id');

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('paniers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id')->unique();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('panier_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('quantite');
            $table->unsignedInteger('panier_id');
            $table->unsignedInteger('product_id');

            $table->foreign('panier_id')->references('id')->on('paniers')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('commands', function (Blueprint $table) {
            $table->increments('id');
            $table->decimal('total', 10, 2);
            $table->string('statut', 50)->nullable();
            $table->string('adresse_livraison', 255)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->unsignedInteger('user_id');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::create('command_lignes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('quantity');
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->unsignedInteger('command_id');
            $table->unsignedInteger('product_id');

            $table->foreign('command_id')->references('id')->on('commands')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('avis', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('note');
            $table->text('comment');
            $table->string('status', 255)->nullable();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('product_id');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type', 255)->nullable();
            $table->string('notifiable_type', 50)->nullable();
            $table->dateTime('created_at');
            $table->dateTime('read_at')->nullable();
            $table->unsignedInteger('notifiable_id');

            $table->foreign('notifiable_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('avis');
        Schema::dropIfExists('command_lignes');
        Schema::dropIfExists('commands');
        Schema::dropIfExists('panier_items');
        Schema::dropIfExists('paniers');
        Schema::dropIfExists('product_img');
        Schema::dropIfExists('products');
        Schema::dropIfExists('cooperatives');
        Schema::dropIfExists('categories');
    }
};