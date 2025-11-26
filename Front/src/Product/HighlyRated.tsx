// Products.tsx

import axios from "axios";
import { useEffect, useContext, useState, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { CiStar } from "react-icons/ci";
import { useSearchParams } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiEye, FiShoppingBag, FiAward } from 'react-icons/fi';
import { AllthePageCanUseIt } from "../main";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  stock_reserved: number;
  image?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  is_in_wishlist?: boolean;
  product_rating_avg_rating: string;
  total_views: number;
 
}

interface Message {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

export default function HighlyRated() {
  const { WishListValue, SetWishListValue, CartValue, SetCartValue } = useContext(AllthePageCanUseIt);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const Token = localStorage.getItem("Token");
  const [Authorized, setAuthorized] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const { t, i18n } = useTranslation();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  // INFINITE SCROLL STATE - REPLACES PAGINATION
  const [loading, setLoading] = useState(true);
  const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 products
  const [products, setProducts] = useState<Product[]>([]);
  const Go = useNavigate()

  // CONSTANTS FOR INFINITE SCROLL
  const PRODUCTS_PER_LOAD = 8;
  const INITIAL_LOAD = 12;

  // MEMOIZED: Get only visible products (performance optimization)
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // FUNCTION: Load more products (client-side)
  const loadMoreProducts = useCallback(() => {
    if (visibleCount >= filteredProducts.length) return;
    
    setLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
    setVisibleCount(prev => prev + PRODUCTS_PER_LOAD);
    setLoading(false);
    }, 300);
  }, [visibleCount, filteredProducts.length]);

  // EFFECT: Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef || visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loading) {
        loadMoreProducts();
      }
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
    );

    observer.observe(loadMoreRef);
    return () => observer.disconnect();
  }, [loadMoreRef, loading, visibleCount, filteredProducts.length, loadMoreProducts]);

  // EFFECT: Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [selectedCategory, searchTerm]);

  // Your existing functions remain the same...
  const getViewsClass = (views: number) => {
    if (views > 100) return 'high-views';
    if (views > 50) return 'medium-views';
    return '';
  };

  useEffect(() => {
    if (Token) {
    loadWishlist();
    }
  }, [Token]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
    setSearchTerm(decodeURIComponent(urlSearch));
    }
  }, [searchParams]);

  const loadWishlist = async () => {
    try {
    const response = await axios.get("/api/wishlist", {
      headers: { Authorization: `Bearer ${Token}` }
    });
    const wishlistItems = response.data.wishlist || [];
    setWishlist(wishlistItems.map((item: any) => item.product_id));
    } catch (error) {
    console.error("Error loading wishlist:", error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
    params.set('search', value.trim());
    } else {
    params.delete('search');
    }
    setSearchParams(params);
  };

  const categories1 = [
          { id: '', label: t('all_product'), icon: FiStar },
    
    { id: 'recommended', label: t('recommended_for_you'), icon: FiAward },
    { id: 'popular', label: t('popular'), icon: FiTrendingUp },
    { id: 'bestseller', label: t('best_seller'), icon: FiShoppingBag },
    { id: 'mostviewed', label: t('most_viewed'), icon: FiEye },
    { id: 'toprated', label: t('highly_rated'), icon: FiStar },
  ];

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

 const toggleWishlist = async (product: Product) => {
    if (!Token) {
    showMessage('error', t('please_login_to_add_wishlist'));
    return;
    }

    try {
    const isCurrentlyInWishlist = wishlist.includes(product.id);
    
    if (isCurrentlyInWishlist) {
      // Remove from wishlist
      const response = await axios.delete(`/api/wishlist/${product.id}`, {
        headers: { Authorization: `Bearer ${Token}` }
      });
      
      if (response.data.success) {
        setWishlist(prev => prev.filter(id => id !== product.id));
        showMessage('success', t('product_removed_from_wishlist', { productName: product.name }));
        SetWishListValue(pev => pev - 1)

      } else {
        showMessage('error', response.data.message || t('failed_to_remove_wishlist'));
      }
    } else {
      // Add to wishlist
      const response = await axios.post("/api/wishlist", 
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      
      if (response.data.success) {
        setWishlist(prev => [...prev, product.id]);
        showMessage('success', t('product_added_to_wishlist', { productName: product.name }));
        SetWishListValue(pev => pev + 1)
        // AAAAASSSS
      } else {
        showMessage('error', response.data.message || t('failed_to_add_wishlist'));
      }
    }
    } catch (error: any) {
    console.error("Wishlist error:", error);
    
    // Handle specific errors
    if (error.response?.data?.message === 'Product is already in your wishlist') {
      showMessage('warning', t('product_already_in_wishlist'));
    } else if (error.response?.data?.message === 'Product not found in your wishlist') {
      showMessage('warning', t('product_not_in_wishlist'));
    } else {
      showMessage('error', error.response?.data?.message || t('error_wishlist_operation'));
    }
    }
  };

  useEffect(() => {
    const updatedProducts = products.map(product => ({
    ...product,
    is_in_wishlist: wishlist.includes(product.id)
    }));
    setProducts(updatedProducts);
  }, [wishlist]);

  const getRatingClass = (rating: any) => {
    if (!rating || rating < 2.5) return 'default';
    if (rating < 3.5) return 'average';
    if (rating < 4.5) return 'good';
    return 'excellent';
  };

  // Load products
  useEffect(() => {
    axios.get(`/api/products/highlyRated`)
    .then(res => {
      console.log("API Response:", res.data.message);
      const productsData = res.data.message;
      console.log(res.data)
      setProducts(productsData);
      const uniqueCategories = ['all', ...new Set(productsData
        .map(product => product.category)
        .filter(Boolean))] as string[];
      setCategories(uniqueCategories);
            

      setLoading(false);
    })
    .catch(error => {
      console.error("API Error:", error);
      setAuthorized(true);
    });
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
    filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const showMessage = (type: Message['type'], text: string) => {
    setMessage({ type, text });
    const duration = type === 'success' ? 3000 : 5000;
    setTimeout(() => {
    setMessage(null);
    }, duration);
  };

   const AddToCart = async (product: Product): Promise<void> => {
    try {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      showMessage('error', t('please_login_to_add_items'));
      return;
    }

    if (product.stock === 0) {
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
      SetCartValue(Pr => Pr + 1)
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

  const handleDetailsClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
    }).format(amount);
  };

  const [activeSection, setActiveSection] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    setActiveSection(prev => categoryId);
    console.log(categoryId)
    setTimeout(()=>{
    	Go(`/products/${categoryId}`)
    }
,100)
  };

  const getCategoryDisplayName = (category: string) => {
    if (category === 'all') return t('all_products');
    return t(category);
  };

  if (Authorized === true) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 text-red-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('unauthorized_access')}</h2>
        <p className="text-gray-600 mb-6">{t('please_login_to_access_products')}</p>
        <button
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.href = '/login'}
        >
          {t('login')}
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-50">
    {/* Top Search Bar */}
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder={t('search_product_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
          </div>
          
          {/* Quick Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">

            {categories1.map((category) => 
            {
              const IconComponent = category.icon;
              return (
                  
                <button
                  key={category.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );

            })}

          </div>
        </div>
      </div>
    </div>

    {/* Message Banner */}
    {message && (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${
        message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
        message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
        message.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
        'bg-blue-50 border border-blue-200 text-blue-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {message.type === 'success' && '✓'}
              {message.type === 'error' && '✗'}
              {message.type === 'warning' && '⚠'}
              {message.type === 'info' && 'ℹ'}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            className="text-lg hover:opacity-70 transition-opacity"
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      </div>
    )}

    {loading && visibleProducts.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">
          {t('loading_products')}
        </p>
      </div>
    ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchTerm ? `${t('search_results_for')} "${searchTerm}"` : t('welcome_to_shopme')} 👨‍💻
          </h1>
          {!searchTerm && (
            <p className="text-gray-600">{t('discover_exceptional_products')}</p>
          )}
        </div>

        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">For you !!</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`relative px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryDisplayName(category)}
                  {selectedCategory === category && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <span className="text-gray-600">
              Showing {visibleProducts.length} of {filteredProducts.length} products
              {selectedCategory !== 'all' && ` ${t('in')} "${getCategoryDisplayName(selectedCategory)}"`}
              {searchTerm && ` ${t('for')} "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {visibleProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image with Wishlist Button */}
              <div className="relative aspect-w-16 aspect-h-12 bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button 
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    product.is_in_wishlist 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  {product.is_in_wishlist ? (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                {/* Views Counter */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  getViewsClass(product.total_views) === 'high-views' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {product.total_views}
                </div>

                {product.category && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {t(product.category)}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-lg font-bold text-gray-900 mb-3">{formatCurrency(product.price)}</div>

                {/* Stock Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock - product.stock_reserved > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock - product.stock_reserved > 0
                      ? `${product.stock - product.stock_reserved} ${t('in_stock')}`
                      : t('out_of_stock')
                    }
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      getRatingClass(product.product_rating_avg_rating) === 'high-rating' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <span className="font-semibold">
                      {product.product_rating_avg_rating ? product.product_rating_avg_rating : "2.0"}
                    </span>
                    <CiStar className="w-3 h-3" />
                  </span>
                </div>
                    
                {/* Product Actions */}
                <div className="flex gap-2">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors ${
                      product.stock - product.stock_reserved === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => AddToCart(product)}
                    disabled={product.stock - product.stock_reserved === 0}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    {product.stock - product.stock_reserved > 0 ? t('add_to_cart') : t('out_of_stock')}
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleDetailsClick(product)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {t('details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INFINITE SCROLL SENTINEL ELEMENT */}
        {visibleCount < filteredProducts.length && (
          <div 
            ref={setLoadMoreRef}
            style={{ 
              height: '1px', 
              visibility: 'hidden' 
            }} 
            aria-hidden="true"
          />
        )}

        {/* LOADING INDICATOR for infinite scroll */}
        {loading && visibleProducts.length > 0 && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading more products...</p>
          </div>
        )}

        {/* END OF LIST MESSAGE */}
        {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            All {filteredProducts.length} products loaded! 🎉
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_products_found')}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all'
                ? t('try_adjusting_search_filters')
                : t('check_back_later_for_new_products')
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                {t('reset_filters')}
              </button>
            )}
          </div>
        )}
      </div>
    )}

    {/* Product Details Modal */}
    {isDetailsModalOpen && selectedProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsDetailsModalOpen(false)}>
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{t('product_details')}</h2>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg aspect-w-1 aspect-h-1">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 lg:h-80 flex items-center justify-center text-gray-400 rounded-lg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                  <div className="text-3xl font-bold text-blue-600 mb-4">{formatCurrency(selectedProduct.price)}</div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.stock - selectedProduct.stock_reserved > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedProduct.stock - selectedProduct.stock_reserved > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {selectedProduct.stock - selectedProduct.stock_reserved > 0
                        ? `${selectedProduct.stock - selectedProduct.stock_reserved} ${t('in_stock')}`
                        : t('out_of_stock')
                      }
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('description')}</h3>
                  <p className="text-gray-600">{selectedProduct.description || t('no_description_available')}</p>
                </div>

                {selectedProduct.category && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('category')}</h3>
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {t(selectedProduct.category)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      selectedProduct.stock - selectedProduct.stock_reserved === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => {
                      AddToCart(selectedProduct);
                      setIsDetailsModalOpen(false);
                    }}
                    disabled={selectedProduct.stock - selectedProduct.stock_reserved === 0}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    {selectedProduct.stock - selectedProduct.stock_reserved > 0
                      ? t('add_to_cart')
                      : t('product_sold_out')
                    }
                  </button>
                  
                  <button
                    className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-lg font-medium transition-colors ${
                      selectedProduct.is_in_wishlist 
                        ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {toggleWishlist(selectedProduct),setIsDetailsModalOpen(false);}}
                  >
                    {selectedProduct.is_in_wishlist ? (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    {selectedProduct.is_in_wishlist ? t('remove_from_wishlist') : t('add_to_wishlist')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}
