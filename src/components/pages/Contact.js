import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'support@gradingai.vn', color: '#0891b2' },
    { icon: '📞', label: 'Hotline', value: '1900 xxxx xx', color: '#059669' },
    { icon: '📍', label: 'Địa chỉ', value: 'TP. Hồ Chí Minh, Việt Nam', color: '#0284c7' },
    { icon: '⏰', label: 'Giờ làm việc', value: 'T2-T6: 8:00 - 17:30', color: '#7c3aed' },
  ];

  const faqs = [
    { q: 'Làm sao để bắt đầu sử dụng GradingAI?', a: 'Bạn chỉ cần đăng ký tài khoản miễn phí và bắt đầu tạo lớp học ngay.' },
    { q: 'GradingAI có miễn phí không?', a: 'Có! Chúng tôi có gói miễn phí với đầy đủ tính năng cơ bản.' },
    { q: 'Dữ liệu có được bảo mật không?', a: 'Tất cả dữ liệu được mã hóa theo tiêu chuẩn quốc tế.' },
  ];

  return (
    <div className="contact-page-new">
      {/* Hero Section */}
      <section className="contact-hero">
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
            <span className="hero-badge">💬 Liên hệ</span>
            <h1>Chúng tôi luôn <span className="text-gradient">sẵn sàng</span> hỗ trợ</h1>
            <p>Có câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với đội ngũ của chúng tôi - chúng tôi sẽ phản hồi trong vòng 24h.</p>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-icon">💌</div>
              <div className="visual-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="info-container">
          {contactInfo.map((info, index) => (
            <div key={index} className="info-card" style={{ '--accent': info.color }}>
              <div className="info-icon">{info.icon}</div>
              <div className="info-label">{info.label}</div>
              <div className="info-value">{info.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main-section">
        <div className="main-container">
          {/* Contact Form */}
          <div className="form-card">
            <div className="form-header">
              <span className="section-badge">✉️ Gửi tin nhắn</span>
              <h2>Liên hệ với chúng tôi</h2>
              <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi nhanh nhất có thể</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>👤 Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>📧 Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>📝 Chủ đề</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="general">Câu hỏi chung</option>
                  <option value="support">Hỗ trợ kỹ thuật</option>
                  <option value="billing">Thanh toán & Gói dịch vụ</option>
                  <option value="partnership">Hợp tác</option>
                  <option value="feedback">Góp ý & Phản hồi</option>
                </select>
              </div>

              <div className="form-group">
                <label>💬 Nội dung</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn..."
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? '⏳ Đang gửi...' : '🚀 Gửi tin nhắn'}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="faq-card">
            <div className="faq-header">
              <span className="section-badge">❓ FAQ</span>
              <h2>Câu hỏi thường gặp</h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-icon">💡</span>
                    {faq.q}
                  </div>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              ))}
            </div>

            <div className="social-section">
              <h3>Theo dõi chúng tôi</h3>
              <div className="social-links">
                <a href="#" className="social-link facebook">📘 Facebook</a>
                <a href="#" className="social-link youtube">📺 YouTube</a>
                <a href="#" className="social-link linkedin">💼 LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>Bản đồ vị trí văn phòng</p>
            <span>TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <p>© 2024 GradingAI. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Contact;
