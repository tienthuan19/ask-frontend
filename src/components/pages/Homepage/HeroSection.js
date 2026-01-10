import React from 'react';
import AIVisual from './AIVisual.js';

const HeroSection = ({ onGetStarted, onWatchDemo }) => {
  return (
    <section className="hero-modern">
      <div className="hero-grid">
        <div className="hero-content-modern">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Grading Platform</span>
          </div>
          
          <h1 className="hero-title-modern">
            Chấm điểm bài luận
            <br />
            <span className="gradient-text">thông minh & chính xác</span>
          </h1>
          
          <p className="hero-desc-modern">
            Hệ thống AI tiên tiến giúp chấm điểm và phân tích bài luận lịch sử một cách 
            khách quan, nhanh chóng và đưa ra phản hồi chi tiết để cải thiện kỹ năng viết.
          </p>

          <div className="hero-actions-modern">
            <button className="btn-primary-modern" onClick={onGetStarted}>
              <span>Thử ngay miễn phí</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="btn-demo-modern" onClick={onWatchDemo}>
              <div className="demo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Xem demo</span>
            </button>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">2,500+</span>
              <span className="trust-label">Bài luận đã chấm</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">98.5%</span>
              <span className="trust-label">Độ chính xác</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-number">4.9/5</span>
              <span className="trust-label">Đánh giá</span>
            </div>
          </div>
        </div>

        <AIVisual />
      </div>
    </section>
  );
};

export default HeroSection;
