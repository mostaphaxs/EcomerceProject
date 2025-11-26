<?php


namespace App\Models;

use App\Mail\OrderConfirmationMail;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderDetails extends Model
{
    use HasFactory;

     protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'produit_name',
        'Total_Price'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'Total_Price' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }  

    public function order()
    {
        return $this->belongsTo(Order::class);
    }  
}