import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import '../../styles/globals.css';
import '../../styles/pages/role-selector.css';
import {registerAPI} from "../../services/authService.js";

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Sửa lại logic redirect một chút bên dưới
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isProcessing, setIsProcessing] = useState(false);
  // Lấy dữ liệu từ trang Login gửi sang
  const registerData = location.state?.registerData;
  // Lấy tempToken từ OAuth2 (nếu có)
  const tempToken = searchParams.get('tempToken');

  useEffect(() => {
    // === LOGIC QUAN TRỌNG: Nếu có tempToken thì KHÔNG redirect ===
    if (tempToken) return;

    // Nếu có registerData (đang đăng ký thường) thì cũng KHÔNG redirect
    if (registerData) return;

    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    const isAdmin = userId === 'admin@gradingai.com' || userId === 'admin@grading.com';

    if (!isLoggedIn) {
      setIsRedirecting(true);
      navigate('/login');
    } else {
      if (isAdmin) {
        setIsRedirecting(true);
        localStorage.setItem('userRole', 'admin');
        navigate('/multi-accounting-dashboard');
      } else {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole && savedRole !== 'admin') {
          setIsRedirecting(true);
          navigate(savedRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        }
        if (savedRole === 'admin') {
          localStorage.removeItem('userRole');
        }
      }
    }
  }, [navigate, registerData, tempToken]); // Thêm dependencies

  const handleRoleSelect = async (role) => {
    // Nếu đây là luồng OAUTH2 (có tempToken)
    if (tempToken) {
      setIsProcessing(true);
      try {
        // [4] Gọi API đăng ký dành cho OAuth2
        const response = await oauth2RegisterAPI(tempToken, role);
        const { token, user } = response.data;

        // Lưu thông tin vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', role.toUpperCase()); // Lưu role vừa chọn
        localStorage.setItem('userLoggedIn', 'true');

        alert('Tạo tài khoản thành công!');
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
      } catch (error) {
        console.error(error);
        alert('Lỗi: ' + (error.message || 'Token hết hạn hoặc không hợp lệ'));
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    }
    // Nếu đây là luồng Đăng Ký Thường
    else if (registerData) {
      setIsProcessing(true);
      try {
        await registerAPI(
            registerData.fullName,
            registerData.email,
            registerData.password,
            role
        );
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert('Lỗi đăng ký: ' + (error.message || 'Vui lòng thử lại'));
      } finally {
        setIsProcessing(false);
      }
    }
    // Logic cho User cũ chưa chọn Role
    else {
      localStorage.setItem('userRole', role);
      navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
    }
  };

  // Hiển thị loading nếu đang redirect
  if (isRedirecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          {isRedirecting ? 'Đang chuyển hướng...' : 'Đang tải...'}
        </div>
      </div>
    );
  }

  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  // Chỉ return null khi: Chưa login VÀ Không có dữ liệu đăng ký
  if (!isLoggedIn && !registerData) {
    return null;
  }

  const isAdmin = localStorage.getItem('userId') === 'admin@gradingai.com';
  if (isAdmin) return null;

  // Nếu đã login và có role rồi (trừ khi đang đăng ký mới)
  const savedRole = localStorage.getItem('userRole');
  if (isLoggedIn && savedRole && savedRole !== 'admin' && !registerData) {
    return null;
  }

  const userName = registerData ? registerData.fullName : (localStorage.getItem('userName') || 'bạn');

  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <div className="welcome-section">
          <h1>🎉 Chào mừng bạn!</h1>
          <p>Xin chào <strong>{userName}</strong>, vui lòng chọn vai trò của bạn:</p>
        </div>

        <div className="role-options">
          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''} ${isSelecting && selectedRole === 'teacher' ? 'processing' : ''}`}
            onClick={() => !isSelecting && handleRoleSelect('teacher')}
          >
            <div className="role-icon">👩‍🏫</div>
            <h3>Giáo viên</h3>
            <p>Quản lý lớp học, tạo bài tập và chấm điểm</p>
            <ul>
              <li>📚 Tạo và quản lý lớp học</li>
              <li>📝 Tạo bài tập và đề thi</li>
              <li>📊 Chấm điểm và theo dõi tiến độ</li>
              <li>💬 Giao tiếp với học sinh</li>
            </ul>
            {isSelecting && selectedRole === 'teacher' && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Đang chuyển hướng...</span>
              </div>
            )}
          </div>

          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''} ${isSelecting && selectedRole === 'student' ? 'processing' : ''}`}
            onClick={() => !isSelecting && handleRoleSelect('student')}
          >
            <div className="role-icon">👨‍🎓</div>
            <h3>Học sinh</h3>
            <p>Tham gia lớp học, làm bài tập và theo dõi điểm số</p>
            <ul>
              <li>📖 Tham gia lớp học</li>
              <li>✍️ Làm bài tập và bài kiểm tra</li>
              <li>📈 Xem điểm số và nhận xét</li>
              <li>💬 Trao đổi với giáo viên</li>
            </ul>
            {isSelecting && selectedRole === 'student' && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Đang chuyển hướng...</span>
              </div>
            )}
          </div>
        </div>

        <div className="note-section">
          <p className="note">
            💡 <strong>Lưu ý:</strong> Lựa chọn này sẽ được ghi nhớ cho những lần đăng nhập tiếp theo.
            Bạn có thể thay đổi vai trò trong phần cài đặt tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;