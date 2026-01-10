import React from 'react';

const ProcessSection = () => {
  return (
    <section className="process-modern">
      <div className="container-modern">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Quy trình <span className="gradient-text">đơn giản</span>
          </h2>
          <p className="section-subtitle-modern">
            Chỉ 3 bước để có kết quả chấm điểm chính xác
          </p>
        </div>

        <div className="process-flow-modern">
          <div className="process-step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Tải lên bài luận</h3>
              <p>Tải file Word, PDF hoặc dán trực tiếp nội dung bài viết của bạn.</p>
              <div className="step-visual">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="process-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="process-step">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>AI phân tích</h3>
              <p>Hệ thống AI phân tích toàn diện: nội dung, cấu trúc, logic và độ chính xác lịch sử.</p>
              <div className="step-visual">
                <div className="analysis-demo">
                  <div className="scanning-line"></div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="process-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="process-step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Nhận kết quả</h3>
              <p>Xem điểm số, phản hồi chi tiết và lời khuyên cải thiện được cá nhân hóa.</p>
              <div className="step-visual">
                <div className="result-demo">
                  <div className="score-display">8.5</div>
                  <div className="feedback-items">
                    <div className="feedback-item positive"></div>
                    <div className="feedback-item negative"></div>
                    <div className="feedback-item positive"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
