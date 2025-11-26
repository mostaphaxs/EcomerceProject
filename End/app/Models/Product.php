<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 

class Product extends Model
{
    use   HasApiTokens, HasFactory, Notifiable ;


    protected $fillable = ['name', 'description', 'price', 'stock',"category", 'image','stock_reserved'];




     public function productRating(){
        return $this->hasMany(ProductRating::class);
    }


 
public function wishlistedBy()
{
    return $this->belongsToMany(User::class, 'wishlists')
        ->withTimestamps();
}


public function OrderDetails(){
    return $this -> hasMany(OrderDetails::class) ;
}

public function productviews(){
    return $this -> hasMany(\App\Models\ProductViews::class) ;
}


}

