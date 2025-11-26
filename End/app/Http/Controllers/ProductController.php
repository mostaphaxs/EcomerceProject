<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductViews;
use Illuminate\Http\Request;
use App\Models\UserInterests;
use App\Models\OrderDetails;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller

{


    public function mostViewed(Request $request){

        try{
            

            $MostViewed = Product::with("productviews")
            -> whereHas("productviews")
            -> withSum("productviews as total_View" , "view_number")
            -> orderBy("total_View","desc")
            -> get() ;
            return response()-> json(["message"=> $MostViewed]) ;


        }
        catch(error){

            return response()-> json(["message"=> "Failed to load the data"]) ;

        }
    }


    public function Popular(Request $request){
        try{

            $popular = Cache::remember("most_popular", 3600, function() {
            return Product::where("stock", ">", 0)
                ->select(["id", "category", "description", "image", "name", "price", "stock", "stock_reserved"])
                ->withAvg("productRating as average_rating", "rating")
                ->withSum("productViews as total_views", "view_number")  
                ->withCount("orderDetails as sales_count")               
                ->orderBy("sales_count", "desc")
                ->orderBy("average_rating", "desc") 
                ->orderBy("total_views", "desc")
                ->take(20)
                ->get();
        });

            return response()-> json(["message"=> $popular]) ;

        }
        catch(\Exception $e){
            return response() -> json(["message"=>"Failed To Load"]);

        }
    }

    public function highlyRated(Request $request){

        try{
            $HighlyRated1 = Product::whereHas("productRating")
            
            -> withAvg("productRating","rating")
            -> orderBy("product_rating_avg_rating","desc")
            -> withSum("productviews as total_views" , "view_number")
            -> orderBy("total_views","desc")
            // ->averageProduct()
            -> get();
            return response() -> json(["message"=>$HighlyRated1]);

        }catch(\Exception $e){

            return response() -> json(["message"=>"Failed To Load"]);


        }   
    }


    public function Recomandation(Request $request){
        try{
                if (!Auth() -> check()){
                    return response()->json([
                        "success" => false,
                        "message" => "Log in first " ,
                       
                    ], 410);
                }
                $UserInterest = UserInterests::where("user_id", auth()->id())
                        ->orderBy("weight", "Desc")
                        ->pluck("category");
                        
                    $userOrders = Order::where("user_id", auth()->id())
                        ->with("user")
                        ->orderBy("created_at", "DESC")
                        ->limit(6)
                        ->get();
                    $UserName = Auth() -> user() -> name;

                    $ItemsInCart = Cart::where("user_id", auth()->id())->count();
                    
                    $personalizedRecommendations = $this->getPersonalizedRecommendations(auth()->id());

                    return response()->json([
                        "success" => true,
                        "message" => "Orders retrieved successfully",
                        "data" => $userOrders,
                        "countCart" => $ItemsInCart,
                        "count" => $userOrders->count(),
                        "message" => $personalizedRecommendations,
                        "UserInterests" => $UserInterest, 
                        "UserName" =>  $UserName
                    ], 200);
        }
        catch(error){
            return response()->json([
                        "success" => false,
                        "message" => "Failed to load it " ,
                       
                    ], 500);
        }
            
            
          
    }

       public function getPersonalizedRecommendations($userId)
{
    $UserInterestCategory = UserInterests::where("user_id", $userId)
        ->orderBy("weight", "DESC")
        ->limit(7)
        ->pluck("category");
        
    $recommendations = collect();
    $productsPerCategory = 6;
    
    foreach($UserInterestCategory as $Category) {
        $CategoryProduct = Product::where("category", $Category)
            ->inRandomOrder()
            ->limit($productsPerCategory)
            ->withSum("productViews as total_views", "view_number")
            ->orderBy("total_views", "desc")
            ->get();
            
        $recommendations = $recommendations->merge($CategoryProduct);
    }
    
    return $recommendations->shuffle();
}





    public function BestSeller(Request $request){
        
                
              
            
            

                try

                {
                    
                   $TopProductSelled = Product::where("stock",">",0)
                    -> withCount("OrderDetails as MuchSold")
                    -> orderByDesc("MuchSold")
                    
                    -> limit(20)
                    ->withSum("productViews as total_views", "view_number")
                    ->orderBy("total_views", "desc")
                    -> get()
                    -> toArray()
                     ;
                     return response() -> json(["message"=>$TopProductSelled],200) ;
                }

                catch(error)

                {

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to load Best sellers'
                ], 500);

                }
            
    }

    
      public function index(Request $request)
    {   
        
                    
    $products = Cache::remember('products', 3600, function () {
    return Product::where("stock", ">", 0)
            ->inRandomOrder()
            ->select(["id", "category", "description", "image", "name", "price", "stock", "stock_reserved"])
            ->withAvg("productRating as average_rating", "rating") 
            ->withSum("productViews as total_views", "view_number")
            ->orderBy("total_views", "desc")
            ->get()
            ->toArray();
    });
                        



                    return response()->json(["message"=>$products,"cached" => true]);


        }

















       
public function IncreaseView(Request $request){
    try  {  
        
        if (!auth() -> check()){

            return response() -> json(["error"=>"UnAuthorized"],401);

        }
        DB::beginTransaction();
        
        $IdCheck = $request -> validate(["Userrr"=>"required|integer|min:1|exists:users,id","Product_id"=>"required|integer|min:1|exists:products,id"])  ;
        
        $CreateOrUpdate = \App\Models\ProductViews::updateOrCreate(
            [
                
                "user_id" => $IdCheck["Userrr"],
                "product_id" => $IdCheck["Product_id"]

            ] 
            , 
            [
                "view_number" =>\DB::raw("view_number + 1")  ,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]
        );



        
        
        DB::commit();

          return response()->json([
            'success' => true,
            'message' => 'View incremented successfully',
            'view_count' => $CreateOrUpdate->view_number

        ], 200);
    }
    catch(\Exception $e){
        DB::rollback();

        return response()->json([
                    'success' => false,
                    'error' => 'Erreur interne du serveur'. $e->getMessage()
        ], 500);




    }
        
    }


     
}
