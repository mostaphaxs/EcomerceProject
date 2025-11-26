<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\UserInterests;
use App\Models\Product;

use App\Models\Cart;

use Illuminate\Support\Facades\DB;
use Exception;

class UserHomePageController extends Controller
{
      public function UserAllInformations(Request $request)
{
    // Check if user is authenticated
    if (!auth()->check()) {
        return response()->json([
            "success" => false,
            "message" => "Please login first"
        ], 401);
    }

    try {
        $UserInterest = UserInterests::where("user_id", auth()->id())
            ->orderBy("weight", "Desc")
            ->pluck("category");
            
        $userOrders = Order::where("user_id", auth()->id())
            ->with("user")
            ->orderBy("created_at", "DESC")
            ->limit(4)
            ->get();
        $UserName = Auth() -> user() -> name;
        $UserId = Auth() -> id();
        $ItemsInCart = Cart::where("user_id", auth()->id())->count();
        
        $personalizedRecommendations = $this->getPersonalizedRecommendations(auth()->id());

        return response()->json([
            "success" => true,
            "message" => "Orders retrieved successfully",
            "data" => $userOrders,
            "countCart" => $ItemsInCart,
            "count" => $userOrders->count(),
            "Recommendations" => $personalizedRecommendations,
            "UserInterests" => $UserInterest, // Optional: include user interests
            "UserName" =>  $UserName,
            "UserId" =>  $UserId 
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching user orders: ' . $e->getMessage());
        
        return response()->json([
            "success" => false,
            "message" => "Failed to retrieve orders. Please try again later."
        ], 500);
    }
}

public function getPersonalizedRecommendations($userId)
{
    $UserInterestCategory = UserInterests::where("user_id", $userId)
        ->orderBy("weight", "DESC")
        ->limit(3)
        ->pluck("category");
        
    $recommendations = collect();
    $productsPerCategory = 3;
    
    foreach($UserInterestCategory as $Category) {
        $CategoryProduct = Product::where("category", $Category)
            ->inRandomOrder()
            ->limit($productsPerCategory)
            ->get();
            
        $recommendations = $recommendations->merge($CategoryProduct);
    }
    
    return $recommendations->shuffle();
}



public function UserJustId(Request $request)
{
    
    // Check if user is authenticated
    if (!auth()->check()) {
        return response()->json([
            "success" => false,
            "message" => "Please login first"
        ], 401);
    }


    $UserId = auth()-> id();
    return response() -> json(["message"=>$UserId],200);

    
}


}