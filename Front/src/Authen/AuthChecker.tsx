// components/AuthChecker.jsx
import { useEffect } from 'react';
import axios from 'axios';

const AuthChecker = () => {
    useEffect(() => {
        const checkAuth = async () => {
            const Token = localStorage.getItem("Token");
            if (!Token) {
                return;
            }
            
            try {
                await axios.post("/api/Profile",{}, {
                    headers: { Authorization: `Bearer ${Token}` }
                });
            } catch (error) {
                localStorage.removeItem("Token");
                console.log("Token expired - automatically removed");
            }
        };

        checkAuth();
    }, []); // Empty dependency array - runs once on mount

    return null; // Doesn't render anything
};

export default AuthChecker;