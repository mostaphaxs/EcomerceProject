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
        Schema::create('payements', function (Blueprint $table) {
             $table->id();
            $table->string('transaction_id')->unique(); 
            $table->foreignId('user_id')->constrained(); 
            $table->decimal('amount', 10, 2); 
            $table->string('currency')->default('MAD'); 
            $table->string('status')->default('pending'); 
            $table->string('description'); 
            $table->string('bank_name')->nullable(); 
            $table->string('cmi_transaction_id')->nullable(); 
            $table->text('bank_response')->nullable(); 
            $table->timestamp('paid_at')->nullable(); 
            $table->timestamps(); 
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('table_payement');
    }
};
