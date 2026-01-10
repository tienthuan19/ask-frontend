import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/terms.css';

const Terms = () => {
  const navigate = useNavigate();
  const termCards = [
    { icon: '✓', title: 'Quyền sử dụng', description: 'Bạn được cấp quyền sử dụng GradingAI cho mục đích giáo dục.', color: '#0891b2' },
    { icon: '🔒', title: 'Bảo mật dữ liệu', description: 'Chúng tôi cam kết bảo vệ dữ liệu cá nhân theo quy định GDPR.', color: '#7c3aed' },
    { icon: '⚖️', title: 'Trách nhiệm người dùng', description: 'Người dùng chịu trách nhiệm về nội dung tải lên.', color: '#059669' },
    { icon: '📋', title: 'Quyền sở hữu trí tuệ', description: 'Mọi nội dung và công nghệ thuộc quyền sở hữu của chúng tôi.', color: '#f59e0b' },
  ];
  const detailedTerms = [
    { title: 'Điều khoản sử dụng dịch vụ', content: 'Bằng việc sử dụng GradingAI, bạn đồng ý tuân thủ các điều khoản.' },
    { title: 'Quyền riêng tư và bảo mật', content: 'Chúng tôi thu thập và xử lý dữ liệu cá nhân theo chính sách bảo mật.' },
    { title: 'Giới hạn trách nhiệm', content: 'GradingAI không chịu trách nhiệm về các thiệt hại gián tiếp.' },
    { title: 'Chấm dứt dịch vụ', content: 'Chúng tôi có quyền chấm dứt tài khoản nếu phát hiện vi phạm.' },
  ];
  return (
    <div className="terms-page-new">
      <section className="terms-hero">
        <div className="hero-bg"><div className="hero-gradient"></div><div className="hero-pattern"></div><div className="floating-shapes"><div className="shape shape-1"></div><div className="shape shape-2"></div><div className="shape shape-3"></div></div></div>
        <div className="hero-content">
          <button className="back-btn" onClick={() => navigate('/')}>← Quay lại trang chủ</button>
          <div className="hero-text"><span className="hero-badge">📜 Điều khoản</span><h1>Điều khoản <span className="text-gradient">sử dụng</span></h1><p>Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ GradingAI.</p></div>
          <div className="hero-visual"><div className="visual-card"><div className="visual-icon">📋</div><div className="visual-rings"><div className="ring ring-1"></div><div className="ring ring-2"></div><div className="ring ring-3"></div></div></div></div>
        </div>
      </section>
      <section className="terms-cards-section"><div className="cards-container">{termCards.map((term, index) => (<div key={index} className="term-card" style={{ '--accent': term.color }}><div className="term-icon">{term.icon}</div><h3>{term.title}</h3><p>{term.description}</p></div>))}</div></section>
      <section className="detailed-terms-section"><div className="detailed-container"><div className="detailed-header"><span className="section-badge">📖 Chi tiết</span><h2>Điều khoản chi tiết</h2><p>Các quy định cụ thể về việc sử dụng dịch vụ GradingAI</p></div><div className="terms-list">{detailedTerms.map((term, index) => (<div key={index} className="term-item"><div className="term-number">{index + 1}</div><div className="term-content"><h3>{term.title}</h3><p>{term.content}</p></div></div>))}</div></div></section>
      <section className="notice-section"><div className="notice-container"><div className="notice-card"><div className="notice-icon">⚠️</div><div className="notice-content"><h3>Lưu ý quan trọng</h3><p>Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với các điều khoản.</p></div></div></div></section>
      <section className="terms-cta"><div className="cta-container"><div className="cta-content"><h2>Có câu hỏi về điều khoản?</h2><p>Liên hệ với chúng tôi để được giải đáp thắc mắc</p><div className="cta-buttons"><button className="btn-primary" onClick={() => navigate('/contact')}>�� Liên hệ ngay</button><button className="btn-secondary" onClick={() => navigate('/support')}>🎧 Trung tâm hỗ trợ</button></div></div></div></section>
      <footer className="terms-footer"><p>© 2024 GradingAI. Tất cả quyền được bảo lưu.</p></footer>
    </div>
  );
};
export default Terms;
