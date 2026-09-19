<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('note');
            $table->text('comment')->nullable();
            $table->string('status', 255)->default('pending');
            $table->integer('user_id');
            $table->integer('product_id');

            $table->foreign('user_id', 'fk_avis_user')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('product_id', 'fk_avis_product')
                ->references('id')->on('products')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['user_id', 'product_id'], 'uniq_avis_user_product');
            $table->index('product_id', 'idx_avis_product_id');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE avis ADD CONSTRAINT chk_avis_note CHECK (note BETWEEN 1 AND 5)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};
