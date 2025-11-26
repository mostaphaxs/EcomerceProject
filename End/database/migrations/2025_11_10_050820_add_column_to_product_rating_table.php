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
        Schema::table('products_rating', function (Blueprint $table) {
            $table -> index("product_id") ;
            $table -> index("rating") ;
            $table -> index(["rating","product_id"]) ;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_rating', function (Blueprint $table) {
            $table -> dropIndex(["rating","product_id"]);
            $table -> dropIndex("product_id");
            $table -> dropIndex("rating");
        });
    }
};
