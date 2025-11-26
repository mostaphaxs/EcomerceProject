<?php

use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController ;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\UserHomePageController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\SocialAuthController; 

Route::middleware("auth:sanctum") -> group( function (){

Route::post('/profile/image/update', [ProfileController::class, 'updateImage']);

Route::post('/profile/image/delete', [ProfileController::class, 'deleteImage']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::post("/Profile",[ProfileController::class,"Profile"] ) ;

Route::post("/save",[ProfileController::class,"save"] ) ;

Route::post("/AddToCart",[CartController::class,'AddToCart']);

Route::get("/CartView",[CartController::class,'Index'])   ;



Route::post("/DeleteCart",[CartController::class,'Deleting'])   ;

Route::post('/orders/confirm', [OrderController::class, 'confirmOrder']);

Route::get("/ViewOrders",[OrderController::class,'Index1']) ;

Route::post('/ModifyCart',[CartController::class,'Modification']);

Route::post('/ToOrders',[OrderController::class,'ToOrders']) ;

Route::post("/DeleteOrder",[OrderController::class,'Deleting'])   ;

Route::get('/orderDetails/{orderId}', [OrderController::class, 'getOrderDetails']);

Route::get('/user', function (Request $request) {return $request->user();});

Route::put('/orders/{orderId}', [OrderController::class, 'updateOrder']);

Route::get("/HomePage/UserAllInformations",[UserHomePageController::class,'UserAllInformations']);

Route::get('/wishlist', [WishlistController::class, 'index']);

Route::post('/wishlist', [WishlistController::class, 'store']);

Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
    

Route::post('/wishlist/{productId}/move-to-cart', [WishlistController::class, 'moveToCart']);

Route::delete('/wishlist', [WishlistController::class, 'clear']);

Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check']);

Route::get('/products/recommanded', [ProductController::class, 'Recomandation']);

Route::post("/IncreaseView",[ProductController::class,'IncreaseView']);

Route::get("/User",[UserHomePageController::class,'UserJustId']);
});


Route::get("/auth/{provider}/redirect",[SocialAuthController::class,"redirect"]);

Route::get("/auth/{provider}/callback",[SocialAuthController::class,"callback"]);
Route::get('/login', function () {
    return response()->json([
        'message' => 'Use POST /login for email/password login or social login endpoints'
    ]);
})->name('login');

Route::post('/chat', [ChatController::class, 'sendMessage']);

Route::post('/chat/clear', [ChatController::class, 'clearHistory']);

Route::get('/products/popular', [ProductController::class, 'Popular']);

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/bestSeller', [ProductController::class, 'BestSeller']);

Route::get('/products/highlyRated', [ProductController::class, 'highlyRated']);

Route::get('/products/mostViewed', [ProductController::class, 'mostViewed']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);



