<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash; 
use Exception;

use Illuminate\Support\Facades\Validator; 
class AuthController extends Controller
{


    public function register(Request $request) {
    $Validated = $request -> validate([
                "email" =>"Required|email:rfc,strict,dns,proof,filter|unique:users",
            ]);
    if (User::where("email",$request->input("email")) -> first() ){


    return response()->json(["message"=>"This accounst is already existed"], 409);
    }



   try {

        $response = Http::withHeaders([
                    'X-API-KEY' => 'XyysZZEdasda'
                ])->post("http://localhost:5678/webhook/form-submission",[
                'email' => "sasukiandnaruto416@gmail.com",
                'name' =>  $request->name,  
                'message'=> "Just submited from a form ShopMe Website Ecomerce products" ,
                'submitted_at' => now()->toISOString(),
                'source' => 'laravel-form'
        ]);




                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),

                ]);
                    return response()->json(["message"=>"Success", "Token" => $user->createToken('auth')->plainTextToken], 201);
                
            
                
           
    }
    catch(\Exception $e){
        return response()->json(["message"=>"There is a problem with the internet try again later"], 409);
        
    }
        


    
}

public function login(Request $request) {
   $crediblity = $request -> only('email','password') ;
   if (!Auth::attempt($crediblity) ){
        return response() -> json(["message" => "the password or the email is incoreect"],401);
   }
   // AbdasamadAdmino123 AbdasamadAdmino@gmail.com
   $User =  Auth::user(); 
  
   $Token = $User -> createToken("auth_token") -> plainTextToken  ;
    if ($User -> Admin){
        return response() -> json(["message" => "Admin", "Token" => $Token],200) ;
        
   }
   return response() -> json(["message" => "Succesful loged in", "Token" => $Token],200) ;
}



public function Logout(Request $request)
{
   

    return response()->json(['message' => $request->user()->currentAccessToken()->delete()]);
}








}
