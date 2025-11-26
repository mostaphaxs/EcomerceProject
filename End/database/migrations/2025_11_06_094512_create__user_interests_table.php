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
        Schema::create('user_interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained() -> onDelete("cascade");
            $table->integer('weight')->default(1);
            $table-> enum("category",["electronics","fashion","Furniture","beauty","health","sports","toys","books","baby"]);
            $table->timestamps();


            $table -> unique(["user_id","category"]);

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_interests');
    }
};
