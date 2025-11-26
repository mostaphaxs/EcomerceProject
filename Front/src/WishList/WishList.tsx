// WishList.tsx
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
  import { AllthePageCanUseIt } from "../main";
interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    stock_reserved: number;
    image?: string;
    category?: string;
  };
  created_at: string;
}

export default function WishList() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const Token = localStorage.getItem("Token");
  const { t } = useTranslation();
  const { WishListValue, SetWishListValue, CartValue, SetCartValue } = useContext(AllthePageCanUseIt);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${Token}` }
      });
      setWishlistItems(response.data.wishlist || []);
    } catch (error: any) {
      console.error("Error loading wishlist:", error);
      showMessage('error', error.response?.data?.error || t('error_loading_wishlist'));
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${Token}` }
      });
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      showMessage('success', t('product_removed_from_wishlist'));
        SetWishListValue(prev => prev - 1)

    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      showMessage('error', error.response?.data?.error || t('error_removing_wishlist'));
                SetWishListValue(prev => prev - 1)


    }
  };

  const addToCartFromWishlist = async (product: any) => {

    try {
      const Info = {
        product_id: product.id,
        quantity: 1
      };
      const response = await axios.post("/api/AddToCart", Info, {
        headers: { Authorization: `Bearer ${Token}` }
      });

      if (response.data.success) {
        showMessage('success', t('product_added_to_cart', { productName: product.name }));
        SetWishListValue(prev => 0)

      } else {
        showMessage('error', response.data.error || t('error_adding_to_cart'));
        SetWishListValue(prev => 0)

      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      showMessage('error', error.response?.data?.error || t('error_adding_to_cart'));
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };


if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg font-medium">{t('loading_wishlist')}</p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-50">
    {/* Message Banner */}
    {message && (
      <div className={`flex items-center justify-between p-4 ${
        message.type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <div className="flex items-center">
          <span className="text-sm font-medium">{message.text}</span>
        </div>
        <button 
          className="text-lg hover:opacity-70 transition-opacity"
          onClick={() => setMessage(null)}
        >
          ×
        </button>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('my_wishlist')}</h1>
        <p className="text-gray-600">
          {wishlistItems.length === 0 
            ? t('wishlist_empty_message')
            : t('wishlist_items_count', { count: wishlistItems.length })
          }
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('wishlist_empty')}</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{t('wishlist_empty_description')}</p>
          <Link 
            to="/products" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('explore_products')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                {item.product.image ? (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.product.description || t('no_description_available')}
                </p>
                <div className="text-lg font-bold text-gray-900 mb-3">{formatCurrency(item.product.price)}</div>
                
                {/* Stock Status */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.product.stock - item.product.stock_reserved > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.product.stock - item.product.stock_reserved > 0
                      ? `${item.product.stock - item.product.stock_reserved} ${t('in_stock')}`
                      : t('out_of_stock')
                    }
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      item.product.stock - item.product.stock_reserved === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => addToCartFromWishlist(item.product)}
                    disabled={item.product.stock - item.product.stock_reserved === 0}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    {t('add_to_cart')}
                  </button>
                  
                  <button
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => removeFromWishlist(item.product_id)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}