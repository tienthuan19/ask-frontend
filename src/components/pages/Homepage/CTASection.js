import React from 'react';

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="cta-modern">
      <div className="container-modern">
        <div className="cta-content-modern">
          <h2 className="cta-title-modern">
            Sẵn sàng <span className="gradient-text-light">cải thiện kỹ năng viết luận</span>?
          </h2>
          <p className="cta-subtitle-modern">
            Tham gia cùng hàng ngàn sinh viên đang sử dụng GradingAI để đạt điểm cao hơn.
          </p>
          
          <div className="cta-actions-modern">
            <button className="btn-cta-primary" onClick={onGetStarted}>
              Bắt đầu miễn phí ngay
            </button>
          </div>

          <div className="cta-features">
            <div className="cta-feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Miễn phí hoàn toàn</span>
            </div>
            <div className="cta-feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Không cần thẻ tín dụng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
