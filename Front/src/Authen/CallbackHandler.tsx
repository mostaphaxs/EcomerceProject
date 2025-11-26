import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSocialLoginCallback = async () => {
      try {
        // Get the full URL to extract provider from path
        const pathname = window.location.pathname;
        const provider = pathname.split('/').filter(Boolean)[2]; // 'google' or 'facebook'
        
        if (!provider) {
          throw new Error('No provider specified');
        }

        console.log('Processing callback for:', provider);
        
        // Call your Laravel callback endpoint
        const response = await fetch(`http://localhost:8000/api/auth/${provider}/callback`);
        const data = await response.json();
        
        if (data.success) {
          // Save token and user data (same as your traditional login)
          localStorage.setItem('Token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          console.log('Social login successful:', data.message);
          
          // Redirect based on user role (same as your traditional login)
          setTimeout(() => {
            if (data.message === "Admin") {
              navigate('/Admin');
            } else {
              navigate('/Home');
            }
          }, 1000);
          
        } else {
          throw new Error(data.error);
        }
      } catch (err: any) {
        console.error('Social login failed:', err);
        navigate('/login', { 
          state: { error: err.message || 'Social login failed' } 
        });
      }
    };

    handleSocialLoginCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Social Login
        </h2>
        <p className="text-gray-600">
          Please wait while we authenticate you...
        </p>
      </div>
    </div>
  );
};

export default CallbackHandler;