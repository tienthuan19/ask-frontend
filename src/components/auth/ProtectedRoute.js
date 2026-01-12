import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {

      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || !!localStorage.getItem('token');

      if (!isLoggedIn) {
        console.log('Không có đăng nhập, chuyển về login');
        navigate('/login', { replace: true });
        return;
      }

      const rawRole = localStorage.getItem('userRole');

      if (!rawRole) {
        console.log('Không có role trong storage, chuyển về role selector');
        navigate('/role-selector', { replace: true });
        return;
      }

      const savedRole = rawRole.toLowerCase(); // Chuẩn hóa: "STUDENT" -> "student"
      const targetRole = requiredRole ? requiredRole.toLowerCase() : null;

      if (savedRole === 'admin') {
        setIsChecking(false);
        return;
      }

      if (targetRole && savedRole !== targetRole) {
        console.log(`Role không khớp (Got: ${savedRole}, Expected: ${targetRole}), chuyển về role selector`);
        navigate('/role-selector', { replace: true });
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  useEffect(() => {
    const handleStorageChange = () => {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || !!localStorage.getItem('token');
      if (!isLoggedIn) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || !!localStorage.getItem('token');

  if (isChecking || !isLoggedIn) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Đang kiểm tra quyền truy cập...</div>;
  }

  return children;
};

export default ProtectedRoute;