export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Common
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    login: 'Login',
    logout: 'Logout',
    search: 'Search',
    language: 'Language',
    
    // Product
    addToCart: 'Add to Cart',
    price: 'Price',
    description: 'Description',
    quantity: 'Quantity',
    outOfStock: 'Out of Stock',
    searchProducts: 'Search products...',
    noProductsFound: 'No products found',
    tryDifferentSearch: 'Try a different search term',
    productNotFound: 'Product not found',
    productInformation: 'Product Information',
    details: 'Details',
    
    // Categories
    allCategories: 'All Categories',
    forHer: 'For Her',
    forHim: 'For Him',
    luxury: 'Luxury',
    categories: 'Categories',
    priceRange: 'Price Range',
    
    // Cart
    yourCart: 'Your Cart',
    total: 'Total',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty',
    remove: 'Remove',
    continueShopping: 'Continue Shopping',
    or: 'or',
    
    // Checkout
    shippingInformation: 'Shipping Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    country: 'Country',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    creditCard: 'Credit Card',
    placeOrder: 'Place Order',
    orderConfirmed: 'Order Confirmed!',
    orderConfirmationMessage: 'Thank you for your order. We will contact you shortly with the delivery details.',
    
    // Auth
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    invalidCredentials: 'Invalid email or password',
  },
  ar: {
    // Common
    home: 'الرئيسية',
    products: 'المنتجات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    search: 'بحث',
    language: 'اللغة',
    
    // Product
    addToCart: 'أضف إلى السلة',
    price: 'السعر',
    description: 'الوصف',
    quantity: 'الكمية',
    outOfStock: 'غير متوفر',
    searchProducts: 'ابحث عن المنتجات...',
    noProductsFound: 'لم يتم العثور على منتجات',
    tryDifferentSearch: 'جرب كلمة بحث مختلفة',
    productNotFound: 'المنتج غير موجود',
    productInformation: 'معلومات المنتج',
    details: 'التفاصيل',
    
    // Categories
    allCategories: 'جميع الفئات',
    forHer: 'للنساء',
    forHim: 'للرجال',
    luxury: 'فاخر',
    categories: 'الفئات',
    priceRange: 'نطاق السعر',
    
    // Cart
    yourCart: 'سلة المشتريات',
    total: 'المجموع',
    checkout: 'الدفع',
    emptyCart: 'سلة المشتريات فارغة',
    remove: 'إزالة',
    continueShopping: 'مواصلة التسوق',
    or: 'أو',
    
    // Checkout
    shippingInformation: 'معلومات الشحن',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    country: 'البلد',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    creditCard: 'بطاقة ائتمان',
    placeOrder: 'تأكيد الطلب',
    orderConfirmed: 'تم تأكيد الطلب!',
    orderConfirmationMessage: 'شكراً لطلبك. سنتواصل معك قريباً بتفاصيل التسليم.',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    forgotPassword: 'نسيت كلمة المرور؟',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  backToCart: {
    en: 'Back to Cart',
    ar: 'العودة إلى السلة'
  },
  orderSummary: {
    en: 'Order Summary',
    ar: 'ملخص الطلب'
  },
  subtotal: {
    en: 'Subtotal',
    ar: 'المجموع الفرعي'
  },
  shipping: {
    en: 'Shipping',
    ar: 'الشحن'
  },
  processing: {
    en: 'Processing...',
    ar: 'جاري المعالجة...'
  },
  checkoutError: {
    en: 'An error occurred during checkout',
    ar: 'حدث خطأ أثناء إتمام الطلب'
  },
  orderConfirmationMessage: {
    en: 'Order placed successfully!',
    ar: 'تم تقديم الطلب بنجاح!'
  },
} as const; 