<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductRating extends Model
{

    protected $table = 'products_rating'; 
    
    protected $fillable = [
        "user_id", "product_id", "rating", "review"
    ];

    protected $casts = [
        "user_id" => "integer",
        "product_id" => "integer", 
        "rating" => "integer",
        "review" => "string"
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function product(){
        return $this->belongsTo(Product::class);
    }

}
