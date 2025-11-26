<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

use Illuminate\Notifications\Notifiable;


class Order extends Model
{
    use HasFactory,Notifiable ; 

     protected $fillable = [
        'user_id',
        'payment_method',
        'total_payment',
        'status',
        'shipping_address',
        'detailed_shipping_address',
        'special_instructions',
        'phone_number'
    ];

    protected $casts = [
        'total_payment' => 'decimal:2',
    ];





    public function orderDetails(){
        return $this -> hasMany(OrderDetails::class) ;
    }
    public function user(){
        return $this -> belongsTo(User::class) ; 
    }



}
