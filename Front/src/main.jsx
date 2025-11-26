// main.tsx
import { BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css'   
import { createContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css' // 


export const AllthePageCanUseIt = createContext();

function GlobalProvider({ children }) {
  const [CartValue, SetCartValue] = useState(0);
  const [WishListValue, SetWishListValue] = useState(0);
  const [Userrr, setUserrr] = useState(0);
  const Token = localStorage.getItem("Token");

  useEffect(() => {
    if (Token) {
      axios.get(`/api/User`, {
        headers: { Authorization: `Bearer ${Token}` }
      })
      .then(res => {
        console.log("API Response:", res.data.message);
        setUserrr(res.data.message);
      })
      .catch(error => {
        console.error("API Error:", error);
      });
    }
  }, [Token]);

  const Value = {
    CartValue, SetCartValue, WishListValue, SetWishListValue, Userrr, setUserrr
  };

  return (
    <AllthePageCanUseIt.Provider value={Value}>
      {children}
    </AllthePageCanUseIt.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
     
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);