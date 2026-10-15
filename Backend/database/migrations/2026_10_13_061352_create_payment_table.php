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
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');
            $table->unsignedBigInteger('store_id');
            $table->string('idempotency_key')->unique();
            $table->string('transaction_id')->unique()->nullable();
            $table->string('payment_method');
            $table->string('payment_status');
            $table->decimal('price');
            $table->unsignedBigInteger('subscription_plan_id');
            $table->integer('retry_count')->default(0);
            $table->unsignedBigInteger('user_id');

            $table->foreign('store_id')->references('store_id')->on('stores');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('subscription_plan_id')->references('subscription_plan_id')->on('subscription_plans');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
