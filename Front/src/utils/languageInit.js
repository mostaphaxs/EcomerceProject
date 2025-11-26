// Initialize language settings when app starts
export const initializeLanguage = () => {
  // Get saved language or default to 'en'
  const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
  
  // Set document direction based on language
  if (savedLanguage === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = savedLanguage;
  }
  
  console.log('Language initialized:', savedLanguage);
  return savedLanguage;
};