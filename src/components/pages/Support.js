import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/support.css';

const Support = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "GradingAI có chấm được những loại bài tập nào?",
      answer: "GradingAI có thể chấm đa dạng các loại bài tập bao gồm: bài tập trắc nghiệm, bài luận ngắn, bài tập toán học, lập trình, và nhiều môn học khác. Hệ thống AI của chúng tôi được huấn luyện để hiểu và đánh giá nhiều định dạng câu trả lời khác nhau.",
      icon: "📝"
    },
    {
      question: "Làm thế nào để bắt đầu sử dụng GradingAI?",
      answer: "Để bắt đầu, bạn chỉ cần đăng ký tài khoản miễn phí, tạo lớp học đầu tiên, và tải lên bài tập của học sinh. Hệ thống sẽ tự động phân tích và đưa ra kết quả chấm điểm cùng với phản hồi chi tiết. Chúng tôi cũng cung cấp hướng dẫn chi tiết và video tutorial.",
      icon: "🚀"
    },
    {
      question: "GradingAI có an toàn và bảo mật không?",
      answer: "Chúng tôi sử dụng các biện pháp bảo mật hàng đầu để bảo vệ dữ liệu của bạn. Tất cả thông tin được mã hóa SSL, tuân thủ các tiêu chuẩn GDPR và ISO 27001. Dữ liệu học sinh được lưu trữ an toàn và không bao giờ được chia sẻ với bên thứ ba.",
      icon: "🔒"
    },
    {
      question: "Giá cả của GradingAI như thế nào?",
      answer: "Chúng tôi cung cấp gói miễn phí cho giáo viên cá nhân với tối đa 50 bài tập/tháng. Các gói trả phí bắt đầu từ 99k/tháng với tính năng không giới hạn và hỗ trợ ưu tiên. Trường học có thể liên hệ để được tư vấn gói doanh nghiệp.",
      icon: "💰"
    },
    {
      question: "Tôi có thể tùy chỉnh tiêu chí chấm điểm không?",
      answer: "Có, GradingAI cho phép bạn tùy chỉnh đầy đủ tiêu chí chấm điểm, thang điểm, và các rubric đánh giá. Bạn có thể tạo template riêng cho từng loại bài tập và lưu lại để sử dụng cho các lần sau.",
      icon: "⚙️"
    },
    {
      question: "Nếu có vấn đề kỹ thuật, tôi liên hệ ai?",
      answer: "Đội ngũ hỗ trợ của chúng tôi sẵn sàng 24/7. Bạn có thể liên hệ qua email support@gradingai.com, hotline 1900 xxxx, hoặc sử dụng chat trực tiếp trên website. Thời gian phản hồi trung bình là dưới 2 giờ.",
      icon: "🎧"
    }
  ];

  const quickHelp = [
    { icon: '📚', title: 'Tài liệu hướng dẫn', description: 'Hướng dẫn chi tiết từ A-Z', color: '#0891b2' },
    { icon: '🎬', title: 'Video Tutorial', description: 'Học qua video trực quan', color: '#7c3aed' },
    { icon: '👥', title: 'Cộng đồng', description: 'Tham gia cộng đồng giáo viên', color: '#059669' },
    { icon: '💬', title: 'Chat trực tiếp', description: 'Hỗ trợ 24/7 qua chat', color: '#f59e0b' },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="support-page-new">
      {/* Hero Section */}
      <section className="support-hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Quay lại trang chủ
          </button>

          <div className="hero-text">
            <span className="hero-badge">🎧 Hỗ trợ</span>
            <h1>Chúng tôi luôn <span className="text-gradient">sẵn sàng</span> giúp đỡ</h1>
            <p>Tìm câu trả lời nhanh chóng qua FAQ hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.</p>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-icon">🛟</div>
              <div className="visual-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="quick-help-section">
        <div className="help-container">
          {quickHelp.map((item, index) => (
            <div key={index} className="help-card" style={{ '--accent': item.color }}>
              <div className="help-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <span className="section-badge">❓ FAQ</span>
            <h2>Câu hỏi thường gặp</h2>
            <p>Tìm câu trả lời cho những thắc mắc phổ biến nhất</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <div className="faq-question-content">
                    <span className="faq-icon">{faq.icon}</span>
                    <span className="faq-text">{faq.question}</span>
                  </div>
                  <span className={`faq-toggle ${activeIndex === index ? 'open' : ''}`}>
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </div>
                <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="support-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Vẫn cần hỗ trợ?</h2>
            <p>Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => navigate('/contact')}>
                📞 Liên hệ ngay
              </button>
              <button className="btn-secondary" onClick={() => window.open('mailto:support@gradingai.vn')}>
                📧 Gửi email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="support-footer">
        <p>© 2024 GradingAI. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Support;
