<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Cart;
use App\Models\User;
use App\Models\Order;
use App\Models\ProductRating;
use App\Models\UserInterests;


use App\Models\OrderDetails;


use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ConfirmEmail;
use Exception;

class OrderController extends Controller

{



public function updateOrder(Request $request, $orderId)
{
    if (!auth()->user()) {
        return response()->json(['error' => "Non autorisé"], 401);
    }

    try {
        $validated = $request->validate([
            'payment_method' => 'required|string|in:cash,card,paypal,before_delivery,after_delivery',
            'shipping_address' => 'required|string|min:5',
            'detailed_shipping_address' => 'required|string|min:10',
            'phone_number' => 'required|string|min:10',
            'special_instructions' => 'nullable|string',
            'total_payment' => 'required|numeric|min:0',
            'order_details' => 'required|array|min:1',
            'order_details.*.product_id' => 'required|integer|exists:products,id',
            'order_details.*.quantity' => 'required|integer|min:1',
            'order_details.*.unit_price' => 'required|numeric|min:0',
            'order_details.*.produit_name' => 'required|string',
            'order_details.*.Total_Price' => 'required|numeric|min:0'
        ]);

        $user = auth()-> id();

        DB::beginTransaction();

         $order = Order::where('id', $orderId)
        ->where('user_id', $user )  
        ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'error' => 'Commande non trouvée'
            ], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'error' => 'Cette commande ne peut pas être modifiée (statut: ' . $order->status . ')'
            ], 400);
        }

        
        $order->update([
            'payment_method' => $validated['payment_method'],
            'shipping_address' => $validated['shipping_address'],
            'detailed_shipping_address' => $validated['detailed_shipping_address'],
            'phone_number' => $validated['phone_number'],
            'special_instructions' => $validated['special_instructions'] ?? '',
            'total_payment' => $validated['total_payment'],
        ]);

        DB::commit();

        $order->load('orderDetails');

        return response()->json([
            'success' => true,
            'message' => 'Commande modifiée avec succès',
            'order' => $order
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erreur de validation',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Erreur modification commande: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'error' => 'Erreur interne du serveur'
        ], 500);
    }
}




    
    public function getOrderDetails($orderId)
{
    if (!auth()->user()) {
        return response()->json(['error' => "Non autorisé"], 401);
    }

    try {
        $order = Order::with('orderDetails')
            ->where('id', $orderId)
            ->where('user_id', auth()->id())
            ->first();

        if (!$order) {
            return response()->json(['error' => 'Commande non trouvée'], 404);
        }

        return response()->json([
            'order' => $order
        ]);

    } catch (\Exception $e) {
        \Log::error('Erreur récupération détails commande: ' . $e->getMessage());
        return response()->json(['error' => 'Erreur interne du serveur'], 500);
    }
}



     public function confirmOrder(Request $request)
    {
        if (!auth()->user() ) {
            return response()->json(['error' => "Non autorisé"], 401);
        }
          


        
        try {
            
            
              $validated = $request -> validate( [
                'order_id' => 'required|integer|exists:orders,id',
                'payment_method' => 'required|string|in:cash,card,paypal,before_delivery,after_delivery',
                'shipping_address' => 'required|string|min:5',
                'detailed_shipping_address' => 'required|string|min:10',
                'phone_number' => 'required|string|min:10',
                'special_instructions' => 'nullable|string'
            ]);

            
            
            $user=auth()->user();

            DB::beginTransaction();

            $order = Order::find($validated['order_id']);
            
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'error' => 'Cette commande ne vous appartient pas'
                ], 403);
            }

            if ($order->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'error' => 'Cette commande ne peut pas être confirmée (statut: ' . $order->status . ')'
                ], 400);
            }

            $order->update([
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
                'detailed_shipping_address' => $validated['detailed_shipping_address'],
                'phone_number' => $validated['phone_number'],
                'special_instructions' => $validated['special_instructions'] ?? '',
                'status' => 'processing'
            ]);
            $DetailsOrder = $order->OrderDetails;
             foreach($DetailsOrder   as $DetailOrder ){
                        $QuantityReserved = $DetailOrder["quantity"] ;
                        $product = $DetailOrder -> product;
                    //     $product -> update([
                    //         "stock" =>$product->stock -$QuantityReserved    ,
                    //         "stock_reserved" =>$product->stock_reserved-$QuantityReserved
                    // ]);
                     if ($product->stock < $QuantityReserved) {
                        throw new Exception("Insufficient stock for product: " . $product->name);
                    }
                    $product -> decrement("stock",$QuantityReserved) ;
                    $product -> decrement("stock_reserved",$QuantityReserved);
                    }  ;

            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Commande confirmée avec succès',
                'order' => $order->load('OrderDetails')
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur confirmation commande: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Erreur interne du serveur: ' . $e->getMessage()
            ], 500);
        }
    }





    

    public function Deleting(Request $request)
    {
        
        if (!auth() -> user())
        {
            return response() -> json(["error" =>"Your are not Authorized !! "],401);
        }

        
        try{
                $IdOrder = $request -> validate([
            "IdOrder" => "Required|integer|min:1|exists:orders,id"
        ]);

        DB::beginTransaction();
                    $Order = Order::find($IdOrder["IdOrder"]) ;
                    $DetailsOrder = $Order-> OrderDetails  ;
                    
            if (!$Order || auth()->id() !== $Order->user_id) {
                    return response()->json(["error" => "You cannot delete or modify an order that doesn't belong to you!" ], 403); 
            }
                    foreach($DetailsOrder   as $DetailOrder ){
                        $QuantityReserved = $DetailOrder["quantity"] ;
                        $product = $DetailOrder -> product;
                        $product -> update(["stock_reserved" =>$product -> stock_reserved  - $QuantityReserved ]);
                    }  ;
                
                $Order -> delete() ;
        DB::commit();
                return response()->json(["message"=>"Everything wen successfully"]);

        }
        catch(Exception $e){
             DB::rollBack();
            
            return response()->json([
                'success' => false,
                'error' => 'Erreur interne du serveur: ' . $e->getMessage()
            ], 500);
        }
        

    }




    public function Index1(Request $request){
        if (!auth() -> user() )
        {
            return response() -> json(["Your are not Authorized !! "],401);

        }

       
        $User = auth()-> user() ; 
        

        $OrdersWithDetails = $User  -> orders()
                                    -> with("orderDetails")
                                    -> orderBy("created_at","desc")
                                    -> get() 
                                     

        ;


        if (!$OrdersWithDetails ){
            return response() -> json(["Something went worng !! "],401);

        }

        return response() -> json(["message" => "Everything went successfully" , "Orders"=>$OrdersWithDetails  ]);


        

        

    }








    public function ToOrders(Request $request)
    {
   

        if (!auth()->user()) {
            return response()->json(['error' => "Unauthorized"], 401);
        }

    
        

        try {
            $validated = $request->validate([
                "user_id" => "required|integer|min:1",
                "Cart" => "required|array|min:1",
                "Cart.*.product_id" => "required|integer|exists:products,id",
                "Cart.*.quantity" => "required|integer|min:1",
                "Cart.*.OrderRating" => "integer|min:1",


                "TotalPayment" => "required|numeric|min:1",
                "shipping_address" => "required|string|min:1",
                "payment_method" => "required|string|in:pending,cash,card,paypal",
                "detailed_shipping_address" => "required|string|min:1",
                "special_instructions" => "nullable|string|min:1",
                "phone_number" => "required|string|min:8",
                
            ]);


            $user = User::find($validated["user_id"]);
            if (!$user) {
                return response()->json(['error' => "User not found"], 404);
            }

            if (auth()->id() !== $validated["user_id"]) {
                return response()->json(['error' => "Unauthorized action"], 403);
            }


            DB::beginTransaction();

            $PendingOrderClient = Order::where("user_id",auth()->id())
            ->where("status","pending")
            ->count();
            if ($PendingOrderClient >= 5){
                return response()->json(['error' => "You cannot have  5 orders with an pending Delete one of them ! Or confirm one of them",$PendingOrderClient], 422);
            }
            
         


                 foreach ($validated["Cart"] as $cartItem) {

                        $product = Product::find($cartItem["product_id"]);
                        
                        $productRating = ProductRating::firstOrCreate(
                            [
                                'product_id' => $cartItem['product_id'],
                                'user_id' => $validated['user_id'],
                            ],
                            [
                                'rating' => $cartItem['OrderRating'] ?? 4,
                            ]
);

                        $available = $product->stock - $product->stock_reserved;
                        
                    if ($cartItem["quantity"] > $available) {
                        throw new Exception("Out of stock for  {$product->name} , What remains  {$available} units !");
                    }
            }

               $order = Order::create([
                "user_id" => $validated["user_id"],
                "payment_method" => $validated["payment_method"],
                "total_payment" => $validated["TotalPayment"],
                "shipping_address" => $validated["shipping_address"],
                "status" => "pending",
                "detailed_shipping_address" => $validated["detailed_shipping_address"],
                "special_instructions" => $validated["special_instructions"],
                "phone_number" => $validated["phone_number"]


            ]);

            foreach ($validated["Cart"] as $cartItem) {
                $product = Product::find($cartItem["product_id"]);
                
                $orderDetail = OrderDetails::create([
                    "order_id" => $order->id,
                    "product_id" => $cartItem["product_id"],
                    "quantity" => $cartItem["quantity"],
                    "unit_price" => $product->price,
                    "produit_name" => $product->name,
                    "Total_Price" => (string)($cartItem["quantity"] * $product->price)

                ]);



                
                $product->update([
                    "stock_reserved" => $product->stock_reserved + $cartItem["quantity"]
                ]);

                $CreateInterest = UserInterests::firstOrCreate([
                    "user_id" => $validated["user_id"] ,"category" =>  $product -> category], 
                    [
                        "weight" =>0
                    ]
                    ) ;
                $CreateInterest->increment("weight");
            }
          
            

            $Delete =  Cart::where("user_id", $validated["user_id"])->delete();


            DB::commit();

            return response()->json([
                "message" => "Order created successfully",
                "order_id" => $order->id
            ], 201);

        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage(),
              
            ], 400);
        }
    }
}