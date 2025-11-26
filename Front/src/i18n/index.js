const resources = {
  en: {
    translation: {
      // Navigation (existing)
      "home": "Home",
      "products": "Products",
      "cart": "Cart", 
      "orders": "Orders",
      "register": "Register",
      "login": "Login",
      "profile": "Profile",
      "logout": "Logout",
      "app_name": "ShopMe",
       "modify_order_title": "Modify Order #{{orderId}}",
      "order_modified_success": "Order modified successfully!",
      "modification_error": "Error during modification",
      "validation_errors": "Validation errors",
      "connection_error": "Connection error. Please check your internet connection.",
      "unexpected_error": "An unexpected error occurred",
      
      // Form Labels
      "payment_method": "Payment Method",
      "shipping_address": "Shipping Address",
      "detailed_address": "Detailed Address",
      "phone_number": "Phone Number",
      "special_instructions": "Special Instructions",
      "total_amount": "Total Amount",
      "total_amount_help": "Total amount cannot be modified directly",
      
      // Payment Methods
      "cash": "Cash",
      "card": "Card",
      "paypal": "PayPal",
      
      // Buttons
      "cancel": "Cancel",
      "modifying": "Modifying...",
      "confirm_changes": "Confirm Changes",

      // Home Page
      "welcome": "Welcome to Our Store",
      "welcome_description": "Discover amazing products at great prices",
      "shop_now": "Shop Now",
      "featured_products": "Featured Products",
      "new_arrivals": "New Arrivals",
      "best_sellers": "Best Sellers",

      // Products Page
      "products_page": "All Products",
      "filter_by_category": "Filter by Category",
      "all_categories": "All Categories",
      "electronics": "Electronics",
      "clothing": "Clothing",
      "books": "Books",
      "home_goods": "Home Goods",
      "sort_by": "Sort by",
      "price_low_high": "Price: Low to High",
      "price_high_low": "Price: High to Low",
      "add_to_cart": "Add to Cart",
      "out_of_stock": "Out of Stock",
"no_personalized_recommendations": "No personalized recommendations yet",
"please_login_to_add_items": "Please login to add items to cart",
"product_out_of_stock": "Product is out of stock",
"product_added_to_cart": "{{productName}} added to cart successfully",
"error_adding_to_cart": "Error adding product to cart",
"no_description_available": "No description available",
  "error_wishlist_operation": "Error during wishlist operation",
  "add_to_wishlist": "Add to wishlist",
  "remove_from_wishlist": "Remove from wishlist",
  
  "please_login_to_add_wishlist": "Please login to add to favorites",
  "product_added_to_wishlist": "{{productName}} added to favorites",
  "product_removed_from_wishlist": "{{productName}} removed from favorites",
  "error_wishlist_operation": "Error during wishlist operation",
  "failed_to_add_wishlist": "Failed to add product to wishlist",
  "failed_to_remove_wishlist": "Failed to remove product from wishlist",
  "product_already_in_wishlist": "Product is already in your wishlist",
  "product_not_in_wishlist": "Product not found in your wishlist",
  "add_to_wishlist": "Add to wishlist",
  "remove_from_wishlist": "Remove from wishlist"
,
      // Cart Page
      "shopping_cart": "Shopping Cart",
      "your_cart": "Your Cart",
      "cart_empty": "Your cart is empty",
      "continue_shopping": "Continue Shopping",
      "product": "Product",
      "quantity": "Quantity",
      "price": "Price",
      "total": "Total",
      "remove": "Remove",
      "order_summary": "Order Summary",
      "subtotal": "Subtotal",
      "shipping": "Shipping",
      "tax": "Tax",
      "proceed_to_checkout": "Proceed to Checkout",

      // Auth Pages
      "email": "Email Address",
      "password": "Password",
      "confirm_password": "Confirm Password",
      "full_name": "Full Name",
      "remember_me": "Remember me",
      "forgot_password": "Forgot your password?",
      "dont_have_account": "Don't have an account?",
      "already_have_account": "Already have an account?",
      "sign_up": "Sign Up",
      "sign_in": "Sign In",

      // Profile Page
      "my_profile": "My Profile",
      "account_settings": "Account Settings",
      "order_history": "Order History",
      "address_book": "Address Book",
      "payment_methods": "Payment Methods",
      "save_changes": "Save Changes",
      "edit_profile": "Edit Profile",
  "my_wishlist": "My Wishlist",
  "wishlist_empty": "Wishlist is empty",
  "wishlist_empty_message": "Your wishlist is empty",
  "wishlist_empty_description": "Add products you like to your wishlist to easily find them later",
  "wishlist_items_count": "{{count}} item(s) in your wishlist",
  "please_login_to_add_wishlist": "Please login to add to favorites",
  "product_added_to_wishlist": "{{productName}} added to favorites",
  "product_removed_from_wishlist": "Product removed from favorites",
  "error_wishlist_operation": "Error during operation",
  "error_loading_wishlist": "Error loading wishlist",
  "error_removing_wishlist": "Error removing product",
  "loading_wishlist": "Loading your wishlist...",
      // Common
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "update": "Update",
      "search": "Search...",
      "view_details": "View Details"
    }
  },
  ar: {
    translation: {
      // Navigation
      "home": "الرئيسية",
      "products": "المنتجات", 
      "cart": "عربة التسوق",
      "orders": "الطلبات",
      "register": "إنشاء حساب",
        "my_wishlist": "قائمة أمنياتي",
  "wishlist_empty": "قائمة الأمنيات فارغة",
  "wishlist_empty_message": "قائمة الأمنيات الخاصة بك فارغة",
  "wishlist_empty_description": "أضف المنتجات التي تعجبك إلى قائمة أمنياتك لتجدها بسهولة لاحقاً",
  "wishlist_items_count": "{{count}} عنصر في قائمة أمنياتك",
  "please_login_to_add_wishlist": "يرجى تسجيل الدخول للإضافة إلى المفضلة",
  "product_added_to_wishlist": "تم إضافة {{productName}} إلى المفضلة",
  "product_removed_from_wishlist": "تم إزالة المنتج من المفضلة",
  "error_wishlist_operation": "خطأ أثناء العملية",
  "error_loading_wishlist": "خطأ في تحميل قائمة الأمنيات",
  "error_removing_wishlist": "خطأ في إزالة المنتج",
  "loading_wishlist": "جاري تحميل قائمة أمنياتك...",
      "login": "تسجيل الدخول",
      "profile": "الملف الشخصي", 
      "logout": "تسجيل الخروج",
      "app_name": "شوب مي",
       "modify_order_title": "تعديل الطلب #{{orderId}}",
      "order_modified_success": "تم تعديل الطلب بنجاح!",
      "modification_error": "خطأ أثناء التعديل",
      "validation_errors": "أخطاء التحقق",
      "connection_error": "خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت.",
      "unexpected_error": "حدث خطأ غير متوقع",
      
      // Form Labels
      "payment_method": "طريقة الدفع",
      "shipping_address": "عنوان الشحن",
      "detailed_address": "العنوان التفصيلي",
      "phone_number": "رقم الهاتف",
      "special_instructions": "تعليمات خاصة",
      "total_amount": "المبلغ الإجمالي",
      "total_amount_help": "لا يمكن تعديل المبلغ الإجمالي مباشرة",
      
  "no_personalized_recommendations": "لا توجد توصيات مخصصة بعد",
  "please_login_to_add_items": "يرجى تسجيل الدخول لإضافة عناصر إلى سلة التسوق",
  "product_out_of_stock": "المنتج غير متوفر",
  "product_added_to_cart": "تم إضافة {{productName}} إلى سلة التسوق بنجاح",
  "error_adding_to_cart": "خطأ في إضافة المنتج إلى سلة التسوق",
  "no_description_available": "لا يوجد وصف متاح",

      // Payment Methods
      "cash": "نقدي",
      "card": "بطاقة",
      "paypal": "باي بال",
      
      // Buttons
      "cancel": "إلغاء",
      "modifying": "جاري التعديل...",
      "confirm_changes": "تأكيد التغييرات",
      // Home Page
      "welcome": "مرحبا بكم في متجرنا",
      "welcome_description": "اكتشف منتجات رائعة بأسعار مميزة",
      "shop_now": "تسوق الآن",
      "featured_products": "المنتجات المميزة",
      "new_arrivals": "الوصلات الجديدة",
      "best_sellers": "الأكثر مبيعاً",

      // Products Page
      "products_page": "جميع المنتجات",
      "filter_by_category": "تصفية حسب الفئة",
      "all_categories": "جميع الفئات",
      "electronics": "إلكترونيات",
      "clothing": "ملابس",
      "books": "كتب",
      "home_goods": "منتجات منزلية",
      "sort_by": "ترتيب حسب",
      "price_low_high": "السعر: من الأقل للأعلى",
      "price_high_low": "السعر: من الأعلى للأقل",
      "add_to_cart": "أضف إلى السلة",
      "out_of_stock": "غير متوفر",

      // Cart Page
      "shopping_cart": "عربة التسوق",
      "your_cart": "عربتك",
      "cart_empty": "عربة التسوق فارغة",
      "continue_shopping": "مواصلة التسوق",
      "product": "المنتج",
      "quantity": "الكمية",
      "price": "السعر",
      "total": "المجموع",
      "remove": "إزالة",
      "order_summary": "ملخص الطلب",
      "subtotal": "المجموع الجزئي",
        "error_wishlist_operation": "حدث خطأ أثناء تنفيذ العملية في قائمة الرغبات",
  "add_to_wishlist": "أضف إلى قائمة الأمنيات",
  "remove_from_wishlist": "احذف من قائمة الأمنيات",
      "shipping": "الشحن",
      "tax": "الضريبة",
      "proceed_to_checkout": "إتمام الشراء",
       "all_products": "جميع المنتجات",
      "fashion": "موضة",
      "furniture": "أثاث",
      "beauty": "جمال", 
      "health": "صحة",
      "sports": "رياضة",
      "toys": "ألعاب",
      "baby": "أطفال",
      
      // Authorization & Errors
      "unauthorized_access": "الوصول غير المصرح به",
      "please_login_to_access_products": "يرجى تسجيل الدخول للوصول إلى المنتجات",
      
      // Messages & Alerts
      "please_login_to_add_items": "يرجى تسجيل الدخول لإضافة عناصر إلى السلة",
      "product_out_of_stock": "هذا المنتج غير متوفر حاليًا",
      "product_added_to_cart": "🎉 تمت إضافة {{productName}} إلى السلة!",
      "error_adding_to_cart": "خطأ في الإضافة إلى السلة",
      
      // Search & Filters
      "search_product_placeholder": "ابحث عن منتج...",
      "categories": "الفئات",
      "found": "تم العثور على",
      "in": "في",
      "for": "لـ",
      
      // Product Details
      "product_details": "تفاصيل المنتج",
      "description": "الوصف",
      "category": "الفئة",
      "no_description_available": "لا يوجد وصف متاح لهذا المنتج",
      "product_sold_out": "المنتج نفد",
      
      // Stock & Availability
      "in_stock": "في المخزون",
      "out_of_stock": "نفد من المخزون",
      
      // Actions
      "details": "التفاصيل",
      "add_to_cart": "أضف إلى السلة",
      
      // Pagination
      "previous": "السابق",
      "next": "التالي",
      "page": "صفحة",
      "of": "من",
      "products": "منتجات",
      
  "please_login_to_add_wishlist": "يرجى تسجيل الدخول للإضافة إلى المفضلة",
  "product_added_to_wishlist": "تم إضافة {{productName}} إلى المفضلة",
  "product_removed_from_wishlist": "تم إزالة {{productName}} من المفضلة",
  "error_wishlist_operation": "خطأ أثناء عملية قائمة الأمنيات",
  "failed_to_add_wishlist": "فشل إضافة المنتج إلى قائمة الأمنيات",
  "failed_to_remove_wishlist": "فشل إزالة المنتج من قائمة الأمنيات",
  "product_already_in_wishlist": "المنتج موجود بالفعل في قائمة أمنياتك",
  "product_not_in_wishlist": "المنتج غير موجود في قائمة أمنياتك",
  "add_to_wishlist": "إضافة إلى المفضلة",
  "remove_from_wishlist": "إزالة من المفضلة"
,
      // Empty States
      "no_products_found": "لم يتم العثور على منتجات",
      "try_adjusting_search_filters": "حاول تعديل معايير البحث أو الفلاتر",
      "check_back_later_for_new_products": "ارجع لاحقًا لاكتشاف منتجاتنا الجديدة",
      "reset_filters": "إعادة تعيين الفلاتر",
      
      // Loading
      "loading_products": "جاري تحميل المنتجات...",
      
      // Welcome & Headers
      "welcome_to_shopme": "مرحبًا بكم في ShopMe",
      "discover_exceptional_products": "اكتشف منتجاتنا الاستثنائية"
      // Add French translations similarly...
    }
  },
  fr: {
    translation: {
      // Add French translations here
      "home": "Accueil",
      "products": "Produits",
      "cart": "Panier",
      "home": "Accueil",
      "products": "Produits",
      "cart": "Panier",
      "orders": "Commandes",
      "register": "Créer un compte",
      "login": "Se connecter",
      "profile": "Profil",
      "logout": "Se déconnecter",
      "app_name": "ShopMe",
       "modify_order_title": "Modifier la Commande #{{orderId}}",
      "order_modified_success": "Commande modifiée avec succès !",
      "modification_error": "Erreur lors de la modification",
      "validation_errors": "Erreurs de validation",
      "connection_error": "Erreur de connexion. Vérifiez votre connexion internet.",
      "unexpected_error": "Une erreur inattendue est survenue",
      
      // Form Labels
      "payment_method": "Méthode de Paiement",
      "shipping_address": "Adresse de Livraison",
      "detailed_address": "Adresse Détaillée",
      "phone_number": "Numéro de Téléphone",
      "special_instructions": "Instructions Spéciales",
      "total_amount": "Montant Total",
      "total_amount_help": "Le montant total ne peut pas être modifié directement",
      
      // Payment Methods
      "cash": "Espèces",
      "card": "Carte",
      "paypal": "PayPal",
      
      // Buttons
      "cancel": "Annuler",
      "modifying": "Modification...",
      "confirm_changes": "Confirmer les Modifications",
      // Home Page
      "welcome": "Bienvenue dans notre boutique",
      "welcome_description": "Découvrez des produits incroyables à des prix exceptionnels",
      "shop_now": "Acheter maintenant",
      "featured_products": "Produits en vedette",
      "new_arrivals": "Nouveautés",
      "best_sellers": "Meilleures ventes",

      // Products Page
      "products_page": "Tous les produits",
      "filter_by_category": "Filtrer par catégorie",
      "all_categories": "Toutes les catégories",
      "electronics": "Électronique",
      "clothing": "Vêtements",
      "books": "Livres",
      "home_goods": "Articles ménagers",
      "sort_by": "Trier par",
      "price_low_high": "Prix: Croissant",
      "price_high_low": "Prix: Décroissant",
      "add_to_cart": "Ajouter au panier",
      "out_of_stock": "En rupture de stock",

      // Cart Page
      "shopping_cart": "Panier d'achat",
      "your_cart": "Votre panier",
      "cart_empty": "Votre panier est vide",
      "continue_shopping": "Continuer les achats",
      "product": "Produit",
      "quantity": "Quantité",
      "price": "Prix",
      "total": "Total",
      "remove": "Supprimer",
      "order_summary": "Résumé de la commande",
      "subtotal": "Sous-total",
      "shipping": "Livraison",
      "tax": "Taxe",
      "proceed_to_checkout": "Procéder au paiement",

      // Auth Pages
      "email": "Adresse e-mail",
      "password": "Mot de passe",
      "confirm_password": "Confirmer le mot de passe",
      "full_name": "Nom complet",
      "remember_me": "Se souvenir de moi",
      "forgot_password": "Mot de passe oublié?",
      "dont_have_account": "Vous n'avez pas de compte?",
      "already_have_account": "Vous avez déjà un compte?",
      "sign_up": "S'inscrire",
        "no_personalized_recommendations": "Pas encore de recommandations personnalisées",
  "please_login_to_add_items": "Connectez-vous pour ajouter des articles au panier",
  "product_out_of_stock": "Produit indisponible",
  "product_added_to_cart": "{{productName}} a été ajouté à votre panier",
  "error_adding_to_cart": "Impossible d'ajouter le produit au panier",
  "no_description_available": "Description non disponible",
      "sign_in": "Se connecter",

      // Profile Page
      "my_profile": "Mon profil",
      "account_settings": "Paramètres du compte",
      "order_history": "Historique des commandes",
      "address_book": "Carnet d'adresses",
      "payment_methods": "Moyens de paiement",
      "save_changes": "Enregistrer les modifications",
      "edit_profile": "Modifier le profil",

      // Common
      "loading": "Chargement...",
      "error": "Erreur",
      "success": "Succès",
      "save": "Enregistrer",
      "cancel": "Annuler",
      "delete": "Supprimer",
      "edit": "Modifier",
      "update": "Mettre à jour",
      "search": "Rechercher...",
      "view_details": "Voir les détails",
      
  "my_wishlist": "Ma liste de souhaits",
  "wishlist_empty": "Liste de souhaits vide",
  "wishlist_empty_message": "Votre liste de souhaits est vide",
  "wishlist_empty_description": "Ajoutez des produits que vous aimez à votre liste de souhaits pour les retrouver facilement plus tard",
  "wishlist_items_count": "{{count}} article(s) dans votre liste de souhaits",
  "please_login_to_add_wishlist": "Veuillez vous connecter pour ajouter aux favoris",
  "product_added_to_wishlist": "{{productName}} ajouté aux favoris",
  "product_removed_from_wishlist": "Produit retiré des favoris",
  "error_wishlist_operation": "Erreur lors de l'opération",
  "error_loading_wishlist": "Erreur lors du chargement de la liste de souhaits",
  "error_removing_wishlist": "Erreur lors de la suppression du produit",
  "loading_wishlist": "Chargement de votre liste de souhaits...",

  "please_login_to_add_wishlist": "Veuillez vous connecter pour ajouter aux favoris",
  "product_added_to_wishlist": "{{productName}} ajouté aux favoris",
  "product_removed_from_wishlist": "{{productName}} retiré des favoris",
  "error_wishlist_operation": "Erreur lors de l'opération de la liste de souhaits",
  "failed_to_add_wishlist": "Échec de l'ajout du produit à la liste de souhaits",
  "failed_to_remove_wishlist": "Échec de la suppression du produit de la liste de souhaits",
  "product_already_in_wishlist": "Le produit est déjà dans votre liste de souhaits",
  "product_not_in_wishlist": "Produit non trouvé dans votre liste de souhaits",
  "add_to_wishlist": "Ajouter aux favoris",
  "remove_from_wishlist": "Retirer des favoris",


      // Products Page - Additional
      "all_products": "Tous les produits",
      "fashion": "Mode",
      "furniture": "Meubles",
      "beauty": "Beauté",
      "health": "Santé",
      "sports": "Sports",
      "toys": "Jouets",
      "baby": "Bébé",
      
      // Authorization & Errors
      "unauthorized_access": "Accès non autorisé",
      "please_login_to_access_products": "Veuillez vous connecter pour accéder aux produits",
      
  "error_wishlist_operation": "Erreur lors de l'opération de la liste de souhaits",
  "add_to_wishlist": "Ajouter aux favoris",
  "remove_from_wishlist": "Retirer des favoris"
,
      // Messages & Alerts
      "please_login_to_add_items": "Veuillez vous connecter pour ajouter des articles au panier",
      "product_out_of_stock": "Ce produit est actuellement en rupture de stock",
      "product_added_to_cart": "🎉 {{productName}} a été ajouté au panier !",
      "error_adding_to_cart": "Erreur lors de l'ajout au panier",
      
      // Search & Filters
      "search_product_placeholder": "Rechercher un produit...",
      "categories": "Catégories",
      "found": "trouvé",
      "in": "dans",
      "for": "pour",
      
      // Product Details
      "product_details": "Détails du produit",
      "description": "Description",
      "category": "Catégorie",
      "no_description_available": "Aucune description disponible pour ce produit",
      "product_sold_out": "Produit épuisé",
      
      // Stock & Availability
      "in_stock": "en stock",
      "out_of_stock": "Rupture de stock",
      
      // Actions
      "details": "Détails",
      "add_to_cart": "Ajouter",
      
      // Pagination
      "previous": "Précédent",
      "next": "Suivant",
      "page": "Page",
      "of": "sur",
      "products": "produits",
      
      // Empty States
      "no_products_found": "Aucun produit trouvé",
      "try_adjusting_search_filters": "Essayez de modifier vos critères de recherche ou de filtre",
      "check_back_later_for_new_products": "Revenez plus tard pour découvrir nos nouveautés",
      "reset_filters": "Réinitialiser les filtres",
      
  "please_login_to_add_wishlist": "Veuillez vous connecter pour ajouter aux favoris",
  "product_added_to_wishlist": "{{productName}} ajouté aux favoris",
  "product_removed_from_wishlist": "{{productName}} retiré des favoris",
  "error_wishlist_operation": "Erreur lors de l'opération de la liste de souhaits",
  "failed_to_add_wishlist": "Échec de l'ajout du produit à la liste de souhaits",
  "failed_to_remove_wishlist": "Échec de la suppression du produit de la liste de souhaits",
  "product_already_in_wishlist": "Le produit est déjà dans votre liste de souhaits",
  "product_not_in_wishlist": "Produit non trouvé dans votre liste de souhaits",
  "add_to_wishlist": "Ajouter aux favoris",
  "remove_from_wishlist": "Retirer des favoris"
,
      // Loading
      "loading_products": "Chargement des produits...",
      
      // Welcome & Headers
      "welcome_to_shopme": "Bienvenue sur ShopMe",
      "discover_exceptional_products": "Découvrez nos produits exceptionnels"
    }
  }
};