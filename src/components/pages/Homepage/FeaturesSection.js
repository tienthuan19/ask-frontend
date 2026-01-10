import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="features-modern">
      <div className="container-modern">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Tại sao chọn <span className="gradient-text">GradingAI</span>?
          </h2>
          <p className="section-subtitle-modern">
            Công nghệ AI tiên tiến kết hợp với hiểu biết sâu sắc về giáo dục lịch sử
          </p>
        </div>

        <div className="features-grid-modern">
          <div className="feature-card-modern">
            <div className="feature-icon-modern lightning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Chấm điểm tức thì</h3>
            <p>Nhận kết quả chấm điểm và phân tích chi tiết chỉ trong vài giây, tiết kiệm thời gian đáng kể.</p>
            <div className="feature-highlight">
              <span>⚡ Chỉ 3 giây</span>
            </div>
          </div>

          <div className="feature-card-modern">
            <div className="feature-icon-modern brain">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5V7A2.5 2.5 0 0 0 9.5 9.5H12V7A2.5 2.5 0 0 1 14.5 4.5A2.5 2.5 0 0 1 17 7V9.5A2.5 2.5 0 0 1 14.5 12H12V14.5A2.5 2.5 0 0 0 14.5 17A2.5 2.5 0 0 0 17 14.5V12A2.5 2.5 0 0 0 14.5 9.5H12V7A2.5 2.5 0 0 0 9.5 4.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Phân tích thông minh</h3>
            <p>AI hiểu sâu về ngữ cảnh lịch sử, đánh giá logic luận điểm và độ chính xác thông tin.</p>
            <div className="feature-highlight">
              <span>🧠 AI thông minh</span>
            </div>
          </div>

          <div className="feature-card-modern">
            <div className="feature-icon-modern chart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Báo cáo chi tiết</h3>
            <p>Nhận phản hồi cụ thể về từng khía cạnh: nội dung, cấu trúc, ngữ pháp và cách trình bày.</p>
            <div className="feature-highlight">
              <span>📊 Chi tiết 100%</span>
            </div>
          </div>

          <div className="feature-card-modern">
            <div className="feature-icon-modern shield">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 5V11C4 16 7 19.5 12 22C17 19.5 20 16 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Bảo mật tuyệt đối</h3>
            <p>Dữ liệu của bạn được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất.</p>
            <div className="feature-highlight">
              <span>🔒 An toàn 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
