<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    /**
     * Get user's wishlist
     */
    public function index(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to view your wishlist'
            ], 401);
        }

        try {
            $wishlist = Wishlist::with(['product' => function($query) {
                $query->select('id', 'name', 'price', 'image', 'category', 'stock', 'stock_reserved');
            }])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'DESC')
            ->get();

            return response()->json([
                'success' => true,
                'wishlist' => $wishlist,
                'count' => $wishlist->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching wishlist: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load wishlist'
            ], 500);
        }
    }

    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to add items to wishlist'
            ], 401);
        }

        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id'
        ]);

        try {
            // Check if already in wishlist
            $existing = Wishlist::where('user_id', auth()->id())
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already in your wishlist'
                ], 422);
            }

            $wishlist = Wishlist::create([
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id']
            ]);

            $wishlist->load('product');

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist',
                'wishlist_item' => $wishlist
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error adding to wishlist: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product to wishlist'
            ], 500);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function destroy($productId)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to manage your wishlist'
            ], 401);
        }

        try {
            $wishlistItem = Wishlist::where('user_id', auth()->id())
                ->where('product_id', $productId)
                ->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in your wishlist'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error removing from wishlist: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove product from wishlist'
            ], 500);
        }
    }

    /**
     * Move wishlist item to cart
     */
    public function moveToCart($productId)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to manage your wishlist'
            ], 401);
        }

        try {
            DB::beginTransaction();

            $wishlistItem = Wishlist::with('product')
                ->where('user_id', auth()->id())
                ->where('product_id', $productId)
                ->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in your wishlist'
                ], 404);
            }

            $product = $wishlistItem->product;

            // Check if product is in stock
            $availableStock = $product->stock - $product->stock_reserved;
            if ($availableStock < 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is out of stock'
                ], 422);
            }

            // Check if product is already in cart
            $existingCart = \App\Models\Cart::where('user_id', auth()->id())
                ->where('product_id', $productId)
                ->first();

            if ($existingCart) {
                $existingCart->increment('quantity');
            } else {
                \App\Models\Cart::create([
                    'user_id' => auth()->id(),
                    'product_id' => $productId,
                    'quantity' => 1
                ]);
            }

            // Remove from wishlist
            $wishlistItem->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product moved to cart successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error moving wishlist to cart: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to move product to cart'
            ], 500);
        }
    }

    /**
     * Clear entire wishlist
     */
    public function clear()
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to manage your wishlist'
            ], 401);
        }

        try {
            $deleted = Wishlist::where('user_id', auth()->id())->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully',
                'deleted_count' => $deleted
            ]);

        } catch (\Exception $e) {
            \Log::error('Error clearing wishlist: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist'
            ], 500);
        }
    }

    /**
     * Check if product is in wishlist
     */
    public function check($productId)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'in_wishlist' => false
            ]);
        }

        $inWishlist = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'in_wishlist' => $inWishlist
        ]);
    }
}