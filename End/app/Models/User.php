<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this import

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory,HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'Admin' ,
    ];  
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/app/public/profile-images/' . $this->image);
        }
        
        return asset('storage/app/public/profile-images/Default2.png'); // Default image
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
public function checkToken($token)
{
    return hash_equals($this->api_token, $token);
}

    public function orders(){
        return $this -> hasMany(Order::class);
    }

     public function MyInterest(){
        return $this -> hasMany(UserInterests::class);
    }
public function wishlists()
{
    return $this->hasMany(Wishlist::class);
}

public function wishlistProducts()
{
    return $this->belongsToMany(Product::class, 'wishlists')
        ->withTimestamps();
}
}
