<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Cart ;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
        public function Index(Request $request){
            if (!$request -> user()){
                return response() -> json(["Error","UnAuthorized"],401) ;

            };

            
            $cartItem = Cart::with(["product","user"]) 
            -> where("user_id", $request -> user() -> id )
            ->  get() ;

            return response() -> json(["Carts",$cartItem]) ;
        }


        public function Modification(Request $request){
            
            if (!auth() -> user()){
                return response() -> json(["Error","UnAuthorized"],401) ;

            }

            $Validate = $request -> validate([
                'IdCart' =>  'required|integer'  ,
                
                'Q'=> 'required|integer'
            ]);


            $CartSearch  = Cart::find($Validate['IdCart']);
            if (!$CartSearch){
                return response() -> json(["Error"," The Cart is not existing , Try again later "],409) ;

            }

            if ($Validate['Q'] < 0 ){
                    return response() -> json(["Error","The Quantity is less than 0 !!!"],409) ;

            }

            $CartSearch -> quantity = $Validate['Q']  ;
            $CartSearch -> save() ; 
                

        }   



         public function Deleting(Request $request)
         
{

            if (!auth()->user()){
                return response() -> json(["Error","UnAuthorized"],401) ;

            }


            $Id = $request -> validate([
                "CartId" => "Required|integer|min:1"
            ]);


            $Cart = Cart::find($Id['CartId']);
            if (!$Cart){
                return response() -> json(["message"=>"there is a problem Try Again later","id" => $Id['CartId'] , "Found" => $Cart ]);
            }


            if ($Cart -> user_id  !== auth() -> id()){
                 return response()->json(["message" => "Unauthorized access to cart"], 403);
            }
            $Cart -> delete();

            return response()->json(["message"=>"Everything wen successfully"]);

}

           
        public function AddToCart(Request $request)
{
   
    if (!auth()->user()) {
        return response()->json(["Error" => "Login First"], 401);
    }

    $UserId = auth()->user()->id;
    $ProductId = $request->product_id;
    
   
    if (!Product::find($ProductId)) {
        return response()->json(["Error" => "Product not found"], 404);
    }

 

    $existing = Cart::where("user_id", $UserId)
        ->where("product_id", $ProductId)
        ->first();

     
    if ($existing) {
       
        $existing->quantity += 1;
        $existing->save();
        $cartItem = $existing;
        
    } else {
     
        $cartItem = Cart::create([
            "user_id" => $UserId,
            "product_id" => $ProductId,
            "quantity" => 1,
        ]);
    }



    return response()->json([
        'success' => true,
        'message' => 'Product added to cart',
        'cart_item' => $cartItem
    ]);
}
}

