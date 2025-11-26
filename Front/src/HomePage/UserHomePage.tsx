import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { AllthePageCanUseIt } from '../main';

interface User {
    name: string;
}

interface Order {
    id: number;
    created_at: string;
    shipping_address: string;
    status: string;
    total_payment: string;
    user: User;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    category?: string;
    description?: string;
    stock: number;
    stock_reserved: number;
}

interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface Message {
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
}

export default function UserHomePage() {
  const {SetCartValue} = useContext(AllthePageCanUseIt)
    const [userData, setUserData] = useState<Order[]>([]);
    const [ItemsIncart, setItemsIncart] = useState<number>(0);
    const [OrderCompleted, setOrderCompleted] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Product[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [message, setMessage] = useState<Message | null>(null);
    const [UserName,setUserName] = useState<any>() 
    const { t } = useTranslation();

  const loadWishlist = async () => {
    try {
      const Token = localStorage.getItem("Token")
      const response = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${Token}` }
      });
      setWishlistItems(response.data.wishlist || []);
    } catch (error: any) {
      console.error("Error loading wishlist:", error);
      showMessage('error', error.response?.data?.error || t('error_loading_wishlist'));
    } 
  };
    useEffect(() => {
        const Process = async () => {
            try {
                const Token = localStorage.getItem("Token");
                const UserResponse = await axios.get("/api/HomePage/UserAllInformations", {
                    headers: { Authorization: `Bearer ${Token}` }
                });
                
                console.log("API Response:", UserResponse.data);
                setUserData(UserResponse.data.data);
                setItemsIncart(UserResponse.data.countCart);
                setUserName(UserResponse.data.UserName)
                // Set personalized recommendations from API
                localStorage.setItem("UserId",UserResponse.data.UserId)
                if (UserResponse.data.Recommendations) {
                    setPersonalizedRecommendations(UserResponse.data.Recommendations);
                }

                // Fixed: Count completed orders properly
                const completedOrdersCount = UserResponse.data.data.filter((order: Order) => 
                    order.status === "completed"
                ).length;
                setOrderCompleted(completedOrdersCount);

                // Use actual orders from API for recent orders
                setRecentOrders(UserResponse.data.data.slice(0, 2));

            } catch (error) {
                console.log("Error loading user data:", error);
            }
        };

        Process();
        loadWishlist();
    }, []);

    const showMessage = (type: Message['type'], text: string) => {
        setMessage({ type, text });
        const duration = type === 'success' ? 3000 : 5000;
        setTimeout(() => {
            setMessage(null);
        }, duration);
    };

    // Add to Cart function (same as Products page)
    const AddToCart = async (product: Product): Promise<void> => {
        try {
            const Token = localStorage.getItem("Token");
            if (!Token) {
                showMessage('error', t('please_login_to_add_items'));
                return;
            }

            if (product.stock - product.stock_reserved === 0) {
                showMessage('warning', t('product_out_of_stock'));
                return;
            }

            const Info = {
                product_id: product.id,
                quantity: 1
            };

            const response = await axios.post("/api/AddToCart", Info, {
                headers: { Authorization: `Bearer ${Token}` }
            });

            if (response.data.success) {
                showMessage('success', t('product_added_to_cart', { productName: product.name }));
                // Update cart count

	              SetCartValue(Pr => Pr + 1)
                setItemsIncart(prev => prev + 1);
            } else {
                showMessage('error', response.data.error || t('error_adding_to_cart'));
            }
        } catch (error: any) {
            console.log("Error : ", error);
            if (error.response?.data?.error) {
                showMessage('error', error.response.data.error);
            } else {
                showMessage('error', t('error_adding_to_cart'));
            }
        }
    };

   

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': t('pending'),
            'completed': t('completed'),
            'processing': t('processing'),
            'cancelled': t('cancelled'),
            'shipped': t('shipped')
        };
        return statusMap[status] || status;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };
return (
  
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Message Banner */}
      {message && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 backdrop-blur-lg ${
          message.type === 'success' ? 'bg-emerald-500/90 text-white' :
          message.type === 'error' ? 'bg-rose-500/90 text-white' :
          message.type === 'warning' ? 'bg-amber-500/90 text-white' :
          'bg-blue-500/90 text-white'
        } rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-black/20 border border-white/20`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {message.type === 'success' && '✓'}
              {message.type === 'error' && '✗'}
              {message.type === 'warning' && '⚠'}
              {message.type === 'info' && 'ℹ'}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            className="text-lg hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-white/20"
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {t('welcome_back')}, {UserName || t('user')}! 👋
            </h1>
            <p className="text-blue-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('personalized_shopping_experience')}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-white mb-2">{OrderCompleted}</div>
                <div className="text-blue-200 text-sm font-medium">{t('orders_completed')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-white mb-2">{ItemsIncart}</div>
                <div className="text-blue-200 text-sm font-medium">{t('items_in_cart')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-white mb-2">{wishlistItems.length}</div>
                <div className="text-blue-200 text-sm font-medium">{t('wishlist_items')}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center gap-2"
              >
                <span>{t('continue_shopping')}</span>
                <span className="text-lg">→</span>
              </Link>
              <Link 
                to="/profile" 
                className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
              >
                <span>{t('manage_account')}</span>
                <span className="text-lg">⚙️</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-16 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('recommended_for_you')}</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t('based_on_your_interests')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {personalizedRecommendations.map(product => (
      <div key={product.id} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-50 to-blue-50">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="i-heroicons-photo-20-solid w-12 h-12" />
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3 bg-slate-800 text-white px-2 py-1 text-xs font-medium">
              {t(product.category)}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-base">
            {product.name}
          </h3>
          
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {product.description || t('no_description_available')}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-slate-900">
              {formatCurrency(product.price)}
            </div>
            
            <div className="flex items-center gap-1 text-slate-500">
              <div className="i-heroicons-star-20-solid w-4 h-4 text-amber-500" />
              <span className="text-sm">
                {product.product_rating_avg_rating || "4.5"}
              </span>
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
              product.stock - product.stock_reserved > 0 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-rose-100 text-rose-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                product.stock - product.stock_reserved > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
              {product.stock - product.stock_reserved > 0
                ? `${product.stock - product.stock_reserved} ${t('in_stock')}`
                : t('out_of_stock')
              }
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`w-full py-2.5 px-4 font-medium flex items-center justify-center gap-2 ${
              product.stock - product.stock_reserved === 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            onClick={() => AddToCart(product)}
            disabled={product.stock - product.stock_reserved === 0}
          >
            <div className="i-heroicons-shopping-cart-20-solid w-4 h-4" />
            {product.stock - product.stock_reserved > 0 ? t('add_to_cart') : t('out_of_stock')}
          </button>
        </div>
      </div>
    ))}
    
    {personalizedRecommendations.length === 0 && (
      <div className="col-span-full text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 text-slate-400">
          <div className="i-heroicons-magnifying-glass-20-solid w-full h-full" />
        </div>
        <p className="text-slate-600 mb-4">{t('no_personalized_recommendations')}</p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-6 py-2 bg-slate-800 text-white font-medium hover:bg-slate-700"
        >
          {t('explore_products')}
        </Link>
      </div>
    )}
  </div>


        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-16 bg-gradient-to-br from-white to-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">{t('recent_orders')}</h2>
              <p className="text-slate-600">Your latest purchases and order status</p>
            </div>
            <Link 
              to="/orders" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group mt-4 sm:mt-0"
            >
              {t('view_all_orders')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-lg">Order #{order.id}</h4>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      order.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      order.status === 'cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{formatDate(order.created_at)}</p>
                  <p className="text-2xl font-bold text-slate-900">{order.total_payment} €</p>
                </div>
                <Link 
                  to="/orders" 
                  className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium text-sm group/link"
                >
                  {t('view_details')}
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
            
            {recentOrders.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
                  <div className="i-heroicons-shopping-bag-20-solid w-full h-full" />
                </div>
                <p className="text-slate-600 text-lg mb-6">{t('no_orders_yet')}</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {t('start_shopping')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {t('shop_by_category')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { to: "/products?category=electronics", emoji: "📱", label: t('electronics') },
              { to: "/products?category=clothing", emoji: "👕", label: t('clothing') },
              { to: "/products?category=home", emoji: "🏠", label: t('home_garden') },
              { to: "/products?category=sports", emoji: "⚽", label: t('sports') }
            ].map((category, index) => (
              <Link 
                key={index}
                to={category.to} 
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <span className="font-semibold text-white">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
);
}