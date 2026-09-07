<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Cooperatives
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('slug', 255)->unique();
            $table->text('bio')->nullable();
            $table->string('hq_location', 255)->nullable();
            $table->string('status', 50)->nullable();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 2. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->timestamps();
        });

        // 3. Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_remise', 10, 2)->nullable();
            $table->integer('stock');
            $table->foreignId('coop_id')->constrained('cooperatives')->onDelete('cascade');
            $table->foreignId('cat_id')->constrained('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Product Images
        Schema::create('product_img', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255);
            $table->integer('order')->default(0);
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
        });

        // 5. Paniers
        Schema::create('paniers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 6. Panier Items
        Schema::create('panier_items', function (Blueprint $table) {
            $table->id();
            $table->integer('quantite');
            $table->foreignId('panier_id')->constrained('paniers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
        });

        // 7. Commands
        Schema::create('commands', function (Blueprint $table) {
            $table->id();
            $table->decimal('total', 10, 2);
            $table->string('statut', 50)->default('pending');
            $table->string('adresse_livraison', 255);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 8. Command Lignes
        Schema::create('command_lignes', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->decimal('prix_unitaire', 10, 2);
            $table->foreignId('command_id')->constrained('commands')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
        });

        // 9. Avis
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->integer('note');
            $table->text('comment')->nullable();
            $table->string('status', 255)->default('pending');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
        });

        // 10. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 255);
            $table->string('notifiable_type', 50);
            $table->foreignId('notifiable_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
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
        Schema::dropIfExists('categories');
        Schema::dropIfExists('cooperatives');
    }
};