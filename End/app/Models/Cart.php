<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Cart extends Model
{
    use HasFactory,HasApiTokens,Notifiable;
   /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        "user_id","product_id","quantity"
    ];


    public function user(){
        return $this -> belongsTo(User::class);
    }

    public function product(){
        return $this -> belongsTo(Product::class);
    }
}
