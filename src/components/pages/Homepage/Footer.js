import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="container-modern">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)"/>
                <path d="M2 17L12 22L22 17" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12L12 17L22 12" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="12">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                  <linearGradient id="grad2" x1="2" y1="17" x2="22" y2="22">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                  <linearGradient id="grad3" x1="2" y1="12" x2="22" y2="17">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer-brand-name">GradingAI</span>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Về chúng tôi</h4>
              <a href="/about">Liên hệ</a>
              <a href="/support">Hỗ trợ</a>
              <a href="/terms">Điều khoản</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 GradingAI. Made with <span className="heart">❤️</span> for Vietnamese students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
