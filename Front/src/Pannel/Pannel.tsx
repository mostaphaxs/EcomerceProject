import { CiLogin } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router';
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { PiProjectorScreenChartDuotone } from "react-icons/pi";
import { FaRobot } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { FaHeart } from 'react-icons/fa';
import { createContext, useContext } from 'react';

import { AllthePageCanUseIt } from "../main";

export default function Pannel() {
    const { CartValue, SetCartValue } = useContext(AllthePageCanUseIt);
    const { WishListValue, SetWishListValue } = useContext(AllthePageCanUseIt);
    const Go = useNavigate();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const Token = localStorage.getItem("Token");
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { path: '/home', icon: FaHome, label: t('home'), show: true },
        { path: '/Products', icon: () => <span className="text-lg">📦</span>, label: Token !== null ? t('products') : t('guest_products'), show: true },
        { path: '/Cart', icon: FiShoppingCart, label: t('cart'), show: Token !== null, badge: CartValue },
        { path: '/WishList', icon: FaHeart, label: t('WishList'), show: Token !== null, badge: WishListValue },
        { path: '/Orders', icon: BiSolidPurchaseTag, label: t('orders'), show: Token !== null },
        { path: '/Register', icon: MdAccountCircle, label: t('register'), show: Token === null },
        { path: '/Login', icon: CiLogin, label: t('login'), show: Token === null },
        { path: '/Profile', icon: CgProfile, label: t('profile'), show: Token !== null },
    ];

    return (
        <div className={`bg-white fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-300 ${
    isSticky ? 'shadow-sm' : ''
}`}>
    <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
            
            {/* Brand Section - Clean & Professional */}
            <div className="flex items-center">
                <button 
                    onClick={() => Go("/home")}
                    className="flex items-center gap-3 group"
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transition-colors group-hover:bg-blue-700">
                        <PiProjectorScreenChartDuotone className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{t('app_name')}</span>
                </button>
            </div>

            {/* Navigation Section - Organized Layout */}
            <nav className="flex items-center">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    
                    {/* Main Navigation Items */}
                    {navItems.map((item) => {
                        if (!item.show) return null;
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <button
                                key={item.path}
                                onClick={() => Go(item.path)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                    isActive 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                                {item.badge > 0 && (
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                        item.path === '/Cart' 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-blue-500 text-white'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {/* Language Switcher */}
                    <div className="px-2">
                        <LanguageSwitcher />
                    </div>

                    {/* Spacer to push logout/help to end */}
                    <div className="flex-1"></div>

                    {/* Help Button */}
                    <button 
                        onClick={() => Go("/ChatBot")}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                    >
                        <FaRobot className="w-5 h-5" />
                        <span className="text-sm font-medium">{t('Help')}</span>
                    </button>

                    {/* Logout */}
                    {Token !== null && (
                        <button 
                            onClick={() => Go("/Logout")}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">{t('logout')}</span>
                        </button>
                    )}

                </div>
            </nav>
        </div>
    </div>
</div>
    );
}