import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Also manually save to localStorage for extra safety
    localStorage.setItem('i18nextLng', lng);
    console.log('Language saved:', lng);
    
    // Update document direction for RTL
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lng;
    }
  };

  return (
    <div className="language-switcher" style={{ 
      display: 'flex', 
      gap: '5px',
      background: 'rgba(255,255,255,0.9)',
      padding: '5px',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    }}>
      <button 
        onClick={() => changeLanguage('en')}
        style={{ 
          padding: '5px 10px', 
          border: i18n.language === 'en' ? '2px solid blue' : '1px solid gray',
          background: i18n.language === 'en' ? 'blue' : 'white',
          color: i18n.language === 'en' ? 'white' : 'black',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        style={{ 
          padding: '5px 10px', 
          border: i18n.language === 'ar' ? '2px solid green' : '1px solid gray',
          background: i18n.language === 'ar' ? 'green' : 'white',
          color: i18n.language === 'ar' ? 'white' : 'black',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        AR
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        style={{ 
          padding: '5px 10px', 
          border: i18n.language === 'fr' ? '2px solid red' : '1px solid gray',
          background: i18n.language === 'fr' ? 'red' : 'white',
          color: i18n.language === 'fr' ? 'white' : 'black',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;