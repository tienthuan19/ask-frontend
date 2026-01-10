import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="nav-premium">
      <div className="nav-container">
        <div className="nav-brand-premium">
          <div className="brand-logo-wrapper">
            <div className="brand-logo">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sparkleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285f4" />
                    <stop offset="50%" stopColor="#9b72f2" />
                    <stop offset="100%" stopColor="#d96570" />
                  </linearGradient>
                  <linearGradient id="sparkleGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Main sparkle */}
                <path d="M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z" 
                      fill="url(#sparkleGradient1)" 
                      opacity="0.9"/>
                {/* Secondary sparkle */}
                <path d="M28 8 L29 14 L35 15 L29 16 L28 22 L27 16 L21 15 L27 14 Z" 
                      fill="url(#sparkleGradient2)" 
                      opacity="0.7"/>
                {/* Small accent sparkle */}
                <path d="M12 10 L12.5 13 L15.5 13.5 L12.5 14 L12 17 L11.5 14 L8.5 13.5 L11.5 13 Z" 
                      fill="url(#sparkleGradient1)" 
                      opacity="0.6"/>
              </svg>
            </div>
            <div className="brand-text-wrapper">
              <div className="brand-name">GradingAI</div>
              <div className="brand-tagline">AI-POWERED</div>
            </div>
          </div>
        </div>
        
        <div className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/about')}>
            <span className="nav-item-text">Về chúng tôi</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/contact')}>
            <span className="nav-item-text">Liên hệ</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/support')}>
            <span className="nav-item-text">Hỗ trợ</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/terms')}>
            <span className="nav-item-text">Điều khoản</span>
          </button>
          <button className="nav-cta" onClick={() => navigate('/login')}>
            <span className="nav-cta-text">Đăng nhập</span>
            <div className="nav-cta-shine"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
