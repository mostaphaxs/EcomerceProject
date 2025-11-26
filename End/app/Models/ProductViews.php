<?php

namespace App\Models;
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductViews extends Model
{
    protected $table = 'products_views';
    
    protected $fillable = [
        "user_id","product_id","view_number","ip_address","user_agent"
    ];

    protected $casts = [
        "user_id"=>"integer",
        "product_id"=>"integer",
        "ip_address"=>"string",
        "user_agent"=>"string"
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }

 

    public function user(){
        return $this->belongsTo(User::class);
    }
}