<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

   public function callback($provider)
{
    try {
        $socialUser = Socialite::driver($provider)->stateless()->user();
        
        $user = User::where('email', $socialUser->getEmail())->first();
        
        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email' => $socialUser->getEmail(),
                'password' => bcrypt(Str::random(16)),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'email_verified_at' => now(),
            ]);
        }
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        $isAdmin = $user->Admin ?? false;
        $message = $isAdmin ? "Admin" : "Successful login";
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $isAdmin,
            ],
            'token' => $token,
            'message' => $message
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Authentication failed: ' . $e->getMessage()
        ], 401);
    }
}
}