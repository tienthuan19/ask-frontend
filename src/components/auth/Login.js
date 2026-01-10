import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFingerprint } from "../../hooks/useFingerprint.js";
import { checkMultiAccounting } from "../../services/fingerprintService.js";
import "../../styles/globals.css";
import "../../styles/pages/login.css";
import {loginAPI, registerAPI} from "../../services/authService.js";

// LoginForm Component
const LoginForm = ({ formData, isLoading, fpLoading, visitorId, onInputChange, onSubmit }) => (
    <form className="login-form" onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="Enter your email"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="Enter your password"
                required
            />
        </div>
        <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || fpLoading || !visitorId}
        >
            {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
    </form>
);

// RegisterForm Component
const RegisterForm = ({ formData, isLoading, fpLoading, visitorId, onInputChange, onSubmit }) => (
    <form className="login-form" onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={onInputChange}
                placeholder="Enter your full name"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="Enter your email"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="Create a password"
                required
            />
        </div>
        <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onInputChange}
                placeholder="Confirm your password"
                required
            />
        </div>
        <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || fpLoading || !visitorId}
        >
            {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
    </form>
);

// SocialLogin Component
const SocialLogin = () => (
    <div className="social-login">
        <div className="divider">
            <span>or continue with</span>
        </div>
        <div className="social-buttons">
            <button type="button" className="social-btn google">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
            </button>
            <button type="button" className="social-btn facebook">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
            </button>
        </div>
    </div>
);

// Main Login Component
const Login = () => {
    const navigate = useNavigate();
    // const { visitorId, visitorData, isLoading: fpLoading } = useFingerprint(); // Uncomment khi dùng thật
    const visitorId = "test-visitor-id"; // Dòng này để test, xóa khi dùng hook thật
    const fpLoading = false;

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [securityAlert, setSecurityAlert] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Client-side
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setSecurityAlert({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
            return;
        }

        if (!visitorId) {
            alert('Không thể xác thực thiết bị. Vui lòng thử lại.');
            return;
        }

        setIsLoading(true);
        setSecurityAlert(null);

        try {
            // === 1. REGISTER ===
            if (!isLogin) {
                navigate('/role-selector', {
                    state: {
                        registerData: {
                            fullName: formData.fullName,
                            email: formData.email,
                            password: formData.password
                        }
                    }
                });
                return;
            }

            // === 2. LOGIN ===
            // const multiAccountCheck = await checkMultiAccounting(visitorId, formData.email);
            //
            // if (multiAccountCheck.isBlocked) {
            //     setSecurityAlert({
            //         type: 'error',
            //         message: `🚫 ${multiAccountCheck.message}`
            //     });
            //     setIsLoading(false);
            //     return;
            // }
            //
            // if (multiAccountCheck.isMultiAccounting) {
            //     setSecurityAlert({
            //         type: 'warning',
            //         message: `⚠️ Phát hiện ${multiAccountCheck.accountCount} tài khoản từ thiết bị này!`
            //     });
            // }
            const response = await loginAPI(formData.email, formData.password);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.username);

            const roles = user.roles || [];
            const role = roles.length > 0 ? roles[0] : 'STUDENT'; // Lấy role đầu tiên
            localStorage.setItem('userRole', role);

            setIsLoading(false);

            //const redirectDelay = multiAccountCheck.isMultiAccounting ? 2000 : 0;
            if (roles.includes('ADMIN')) {
                navigate('/multi-accounting-dashboard');
            } else if (roles.includes('TEACHER')) {
                navigate('/teacher-dashboard');
            } else if (roles.includes('STUDENT')) {
                navigate('/student-dashboard');
            } else {
                navigate('/role-selector');
            }

        } catch (error) {
            console.error('Auth error:', error);
            setIsLoading(false);
            const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setSecurityAlert({
                type: 'error',
                message: `❌ ${errorMessage}`
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo"></div>
                <div className="login-header">
                    <h1 className="login-title">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="login-subtitle">
                        {isLogin 
                            ? 'Sign in to your educational platform' 
                            : 'Join our educational community'
                        }
                    </p>
                    {fpLoading && (
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                            🔒 Đang xác thực thiết bị...
                        </p>
                    )}
                    {visitorId && !fpLoading && (
                        <p style={{ fontSize: '12px', color: '#4caf50', marginTop: '8px' }}>
                            ✅ Thiết bị đã được xác thực
                        </p>
                    )}
                </div>

                {securityAlert && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: securityAlert.type === 'error' ? '#f8d7da' : '#fff3cd',
                        border: `1px solid ${securityAlert.type === 'error' ? '#dc3545' : '#ffc107'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#000',
                        fontWeight: securityAlert.type === 'error' ? '600' : 'normal'
                    }}>
                        {securityAlert.message}
                    </div>
                )}

                {isLogin ? (
                    <LoginForm
                        formData={formData}
                        isLoading={isLoading}
                        fpLoading={fpLoading}
                        visitorId={visitorId}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <RegisterForm
                        formData={formData}
                        isLoading={isLoading}
                        fpLoading={fpLoading}
                        visitorId={visitorId}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                )}

                <div className="form-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button"
                            className="switch-button"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

                <SocialLogin />
            </div>
        </div>
    );
};

export default Login;
