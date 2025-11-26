// NotFound.jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <div className="not-found-container" style={{ 
      textAlign: 'center', 
      padding: '50px',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '20px', color: '#ff6b6b' }}>404</h1>
      <h2>{t('page_not_found')}</h2>
      <p style={{ margin: '20px 0', fontSize: '1.1rem' }}>
        {t('page_does_not_exist', { path: location.pathname })}
      </p>
      <p style={{ marginBottom: '30px' }}>
        {t('sorry_page_not_found')}
      </p>
      <Link 
        to="/Home" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        {t('go_back_home')}
      </Link>
    </div>
  );
};

export default NotFound;