import { Routes, Route } from 'react-router-dom';
import Orders from './Orders/Orders';
import Profile from './Profile/Profile';
import Products from './Product/Products';
import Login from "./Authen/Login";
import Footer from './Footer/Footer';
import Pannel from './Pannel/Pannel';
import Register from './Authen/Regester';
import Logout from './Authen/Logout';
import NotFound from './NotFound';
import HomePage from './HomePage/HomePage';
import Admin from './Admin/Admin';
import Cart from './Product/Cart';
import './i18n';
import ChatBot from './AiThings/ChatBot';
import { initializeLanguage } from './utils/languageInit';
import WishList from './WishList/WishList';
import AuthChecker from './Authen/AuthChecker';
import Recommanded from './Product/Recommanded';
import BestSeller from './Product/BestSeller';
import Popular from './Product/Popular';
import MostViewed from './Product/MostViewed';
import HighlyRated from './Product/HighlyRated';
import CallbackHandler from './Authen/CallbackHandler';


import TestUno from '../test';

function App() {
  initializeLanguage();

  return (
    
      <div> 

      <Pannel />
      <AuthChecker />
      <main  style={{ marginTop: '144px'}}>
        <Routes>
          <Route path='/products' element={<Products/>} />
          <Route path='/products/recommended' element={<Recommanded/>} />
          <Route path='/products/bestseller' element={<BestSeller/>} />
          <Route path='/products/popular' element={<Popular/>} />
          <Route path='/products/mostviewed' element={<MostViewed/>} />
          <Route path='/products/toprated' element={<HighlyRated/>} />
          <Route path='/Logout' element={<Logout/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path="/auth/callback" element={<CallbackHandler />} /> 
          <Route path='/profile' element={<Profile/>} />
          <Route path='/Register' element={<Register/>} />
          <Route path='/Login' element={<Login/>} />
          <Route path='/ChatBot' element={<ChatBot/>} />
          <Route path='/test' element={<TestUno/>} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/WishList' element={<WishList />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </main>
      <Footer />
   </div>   
  );
}

export default App;