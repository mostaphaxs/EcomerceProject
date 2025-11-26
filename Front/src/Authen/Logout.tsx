import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';
  

export default function Logout(){
    const Token = localStorage.getItem("Token")
    const Nav = useNavigate()
    const [Loading, setLoading] = useState("")
    const {t} = useTranslation();
    useEffect(() => {
        async function LogOut() {
            axios.post('http://127.0.0.1:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${Token}` }
            })
            .then((R) => {
                setLoading("Successfully logged out")
                
                setTimeout(() => {
                    localStorage.removeItem("Token")
                    console.log(localStorage.getItem("Token"))
                    Nav("/login")
                }, 3000)

                console.log(R.data.message)
            })
            .catch((E) => {
                console.log(E.message)
            })
        }

        LogOut()
    }, [])
  
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Illustration */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 lg:p-12 text-white">
          <div className="flex flex-col justify-center h-full max-w-md mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>
            
            {/* Content */}
            <h2 className="text-2xl font-bold mb-4">{t('goodbye')}</h2>
            <p className="text-blue-100 mb-8">
              {t('secure_logout_message')}
            </p>
            
            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-blue-100">{t('session_cleared')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <span className="text-blue-100">{t('token_revoked')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('logging_out')}
              </h1>
              <p className="text-gray-600">
                {t('secure_session')}
              </p>
            </div>
            
            {/* Logout Content */}
            <div className="text-center">
              {Loading === "" ? (
                <div className="space-y-6">
                  {/* Loading Spinner */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600">{t('securing_session')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Success Message */}
                  <div>
                    <h2 className="text-green-600 text-xl font-semibold text-center mb-4">
                      {t('successfully_logged_out')}
                    </h2>
                    <p className="text-gray-600 text-center">
                      {t('redirecting_login')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}