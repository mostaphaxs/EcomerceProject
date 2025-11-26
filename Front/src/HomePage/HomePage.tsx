import { useEffect, useState } from 'react';
import GuestHomePage from './GuestHomePage';
import UserHomePage from './UserHomePage';

const HomePage = () =>{
     const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("Token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <UserHomePage /> : <GuestHomePage />;
}

export default HomePage 