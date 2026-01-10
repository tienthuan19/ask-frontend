import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Kiểm tra trạng thái đăng nhập
      // Lưu ý: Cần đảm bảo Login.js đã setItem 'userLoggedIn'
      // Nếu bạn dùng check token thì logic sẽ khác (check localStorage.getItem('token'))
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || !!localStorage.getItem('token');

      if (!isLoggedIn) {
        console.log('Không có đăng nhập, chuyển về login');
        navigate('/login', { replace: true });
        return;
      }

      // 2. Lấy role và chuẩn hóa về chữ thường để so sánh không phân biệt hoa thường
      const rawRole = localStorage.getItem('userRole');

      if (!rawRole) {
        console.log('Không có role trong storage, chuyển về role selector');
        navigate('/role-selector', { replace: true });
        return;
      }

      const savedRole = rawRole.toLowerCase(); // Chuẩn hóa: "STUDENT" -> "student"
      const targetRole = requiredRole ? requiredRole.toLowerCase() : null;

      // Admin có quyền truy cập tất cả
      if (savedRole === 'admin') {
        setIsChecking(false);
        return;
      }

      // 3. So sánh role
      if (targetRole && savedRole !== targetRole) {
        console.log(`Role không khớp (Got: ${savedRole}, Expected: ${targetRole}), chuyển về role selector`);
        navigate('/role-selector', { replace: true });
        return;
      }

      // Khớp role hoặc không yêu cầu role cụ thể
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  // Lắng nghe thay đổi localStorage (đăng xuất ở tab khác)
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

  // Render UI
  // Logic hiển thị tương tự useEffect để tránh flash content
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || !!localStorage.getItem('token');

  if (isChecking || !isLoggedIn) {
    // Có thể thay bằng Loading Spinner đẹp hơn
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Đang kiểm tra quyền truy cập...</div>;
  }

  return children;
};

export default ProtectedRoute;