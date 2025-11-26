import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Message {
  color: string;
  Message: string;
}

interface User {
  name?: string;
  email?: string;
  image?: string;
  pathImage?: string;
}

export default function Profile() {
  const [User, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [editing, setEditing] = useState({ name: false, email: false, password: false });
  const [Info, setInfo] = useState({ name: "", email: "", Oldpassword: "", Newpassword: "" });
  const [message, setMessage] = useState<Message>({ color: "", Message: "" });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const Go = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const Token = localStorage.getItem("Token");
  const [isUploading, setisUploading] = useState(false);
  const { t } = useTranslation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async () => {
    if (!image) return;

    setisUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/profile/image/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${Token}`
        }
      });
      
      console.log('Upload successful:', response.data);
      setUser(prev => ({
        ...prev, 
        pathImage: response.data.image_url
      }));
      setMessage({ Message: t('profile_picture_updated_success'), color: "green" });
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ Message: t('error_uploading_image'), color: "red" });
    } finally {
      setisUploading(false);
      setPreview(null);
      setRefreshTrigger(prev => prev + 1);
    }
  };

useEffect(() => { 
  const Ress = axios.post("http://127.0.0.1:8000/api/Profile", {}, {
    headers: { Authorization: `Bearer ${Token}` }
  }).then((rep) => {
    console.log(rep.data.message)
    
    let userData = rep.data.message;
    if (typeof userData === 'string') {
      try {
        userData = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setUser(userData);
    setLoading(false);
  }).catch((error) => {
    console.log(error);
    setLoading(false);
  });
}, [refreshTrigger])
  // Personal Information Modal Functions
  const openPersonalInfoModal = () => {
    setShowPersonalInfoModal(true);
  };

  const closePersonalInfoModal = () => {
    setShowPersonalInfoModal(false);
    setEditing({ name: false, email: false, password: false });
    setInfo({ name: "", email: "", Oldpassword: "", Newpassword: "" });
  };

  async function save(e: React.MouseEvent) {
    const Button = e.currentTarget.getAttribute('name');
     
    if (Button === "Name") {
      setEditing(prev => ({ ...prev, name: false }));
    } else if (Button === "Email") {
      setEditing(prev => ({ ...prev, email: false }));
    } else {
      setEditing(prev => ({ ...prev, password: false }));
    }
    
    const Information = {
      ...(Info.name && { name: Info.name }),
      ...(Info.email && { email: Info.email }),
      ...(Info.Oldpassword && { oldpassword: Info.Oldpassword }),
      ...(Info.Newpassword && { newpassword: Info.Newpassword })
    };

    setInfo({ name: "", email: "", Oldpassword: "", Newpassword: "" })

    setShowPersonalInfoModal(false)

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/save", Information, {
        headers: { Authorization: `Bearer ${Token}` }
      });
      console.log(response.data.message);
      setMessage({ Message: response.data.message, color: "green" });
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.log("Message d'erreur:", error.response?.data?.message);
      setMessage({ Message: error.response?.data?.message, color: "red" });
    }

  }

  function Cancel(e: React.MouseEvent) {
    const button = e.currentTarget.getAttribute('name');
    
    if (button === "Name") {
      setInfo(prev => ({ ...prev, name: "" }));
      setEditing(prev => ({ ...prev, name: false }));
    } else if (button === "Email") {
      setInfo(prev => ({ ...prev, email: "" }));
      setEditing(prev => ({ ...prev, email: false }));
    } else {
      setInfo(prev => ({ ...prev, Newpassword: "", Oldpassword: "" }));
      setEditing(prev => ({ ...prev, password: false }));
    }
  }

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    if (name === "Name") {
      setInfo(prev => ({ ...prev, name: value }));
    } else if (name === "Email") {
      setInfo(prev => ({ ...prev, email: value }));
    } else if (name === "NewPass") {
      setInfo(prev => ({ ...prev, Newpassword: value }));
    } else {
      setInfo(prev => ({ ...prev, Oldpassword: value }));
    }
  }

 if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg font-medium">{t('loading_profile')}</p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('my_profile')}</h1>
        <p className="text-gray-600">{t('manage_personal_info')}</p>
      </div>

      {/* Message */}
      {message.Message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.color === "red" 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          {message.Message}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img 
              src={User.image === null 
                ? `http://127.0.0.1:8000/storage/profile-images/Default2.png`
                : !User.pathImage 
                  ? `http://127.0.0.1:8000/storage/profile-images/${User.image}`
                  : User.pathImage 
                    ? User.pathImage 
                    : ""
              } 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
              
            <button 
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900">
              <span className="text-gray-600">{t("welcome")} </span>
              <span className="text-blue-600">{User.name}</span>
            </h3>
          </div>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <img src={preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                <span className="text-sm font-medium text-gray-700">{t('new_photo')}</span>
              </div>
              
              <div className="flex gap-2 ml-auto">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={uploadImage} 
                  disabled={!image || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('uploading')}
                    </>
                  ) : (
                    t('save')
                  )}
                </button>
                
                <button 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4 mb-6">
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={openPersonalInfoModal}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{t('personal_information')}</h3>
              <p className="text-gray-600 text-sm">{t('manage_name_email_password')}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{t('order_history')}</h3>
              <p className="text-gray-600 text-sm">{t('view_track_orders')}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>

        {/* Shipping Addresses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{t('shipping_addresses')}</h3>
              <p className="text-gray-600 text-sm">{t('manage_delivery_locations')}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{t('welcome_to_shopme')}</h3>
          <p className="opacity-90">
            {t('welcome_profile_message')}
          </p>
        </div>
      </div>
    </div>

    {/* Personal Information Modal */}
    {showPersonalInfoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{t('personal_information')}</h2>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={closePersonalInfoModal}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Name Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('name')}</h3>
                  <p className="text-gray-600 text-sm">{User.name}</p>
                </div>
                <button 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setEditing(prev => ({ ...prev, name: true }))}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {t('edit')}
                </button>
              </div>

              {editing.name && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="text" 
                    value={Info.name} 
                    name="Name" 
                    placeholder={t('new_name_placeholder')} 
                    onChange={handle} 
                  />
                  <div className="flex gap-2">
                    <button name="Name" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={save}>
                      {t('save')}
                    </button>
                    <button name="Name" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={Cancel}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('email')}</h3>
                  <p className="text-gray-600 text-sm">{User.email}</p>
                </div>
                <button 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setEditing(prev => ({ ...prev, email: true }))}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {t('edit')}
                </button>
              </div>

              {editing.email && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="password" 
                    value={Info.Oldpassword} 
                    name="OldPass" 
                    placeholder={t('old_password_placeholder')} 
                    onChange={handle} 
                  />
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="email" 
                    value={Info.email} 
                    name="Email" 
                    placeholder={t('new_email_placeholder')} 
                    onChange={handle} 
                  />
                  <div className="flex gap-2">
                    <button name="Email" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={save}>
                      {t('save')}
                    </button>
                    <button name="Email" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={Cancel}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('password')}</h3>
                  <p className="text-gray-600 text-sm">••••••••</p>
                </div>
                <button 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setEditing(prev => ({ ...prev, password: true }))}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {t('edit')}
                </button>
              </div>

              {editing.password && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="password" 
                    value={Info.Oldpassword} 
                    name="OldPass" 
                    placeholder={t('old_password_placeholder')} 
                    onChange={handle} 
                  />
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="password" 
                    value={Info.Newpassword} 
                    name="NewPass" 
                    placeholder={t('new_password_placeholder')} 
                    onChange={handle}
                  />
                  <div className="flex gap-2">
                    <button name="Pass" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={save}>
                      {t('save')}
                    </button>
                    <button name="Pass" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={Cancel}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

