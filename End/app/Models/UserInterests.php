<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;



class UserInterests extends Model
{
    use  Notifiable;

    protected $fillable = [
        "user_id" , "weight","category"
    ];

    protected $casts = [
        "user_id" =>"integer" , "weight"=>"integer","category"=>"string"
    ];

    public function user(){
        return $this -> belongsTo(User::class);
    }
    
}
