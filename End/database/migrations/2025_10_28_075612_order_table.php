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
        Schema::create("orders",function(Blueprint $table) {
                $table -> id() ;
                $table -> foreignId('user_id') -> constrained() -> onDelete('cascade') ;
                $table -> string('payment_method') ;
                $table -> decimal("total_payment",14,2) ;
                $table -> enum('status',["pending","processing","completed","failed","cancelled","shipped","delivred"]) -> default("pending") ;
                $table -> string("shipping_address") ;
                $table -> string("detailed_shipping_address") ;
                $table -> string("special_instructions");
                $table -> string("phone_number");
                $table -> timestamps() ;

        } );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');

    }
};
