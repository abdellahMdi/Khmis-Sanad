<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('type', 255);
            $table->string('notifiable_type', 50);
            $table->json('data')->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('read_at')->nullable();
            $table->integer('notifiable_id');

            $table->foreign('notifiable_id', 'fk_notifications_user')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->index(['notifiable_type', 'notifiable_id'], 'idx_notifications_notifiable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
