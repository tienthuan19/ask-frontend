import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/about.css';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '10,000+', label: 'Giáo viên tin dùng', icon: '👨‍🏫', color: '#0891b2' },
    { number: '500,000+', label: 'Bài tập được chấm', icon: '📝', color: '#059669' },
    { number: '95%', label: 'Độ chính xác', icon: '🎯', color: '#0284c7' },
    { number: '24/7', label: 'Hỗ trợ liên tục', icon: '💬', color: '#7c3aed' },
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI Thông minh',
      description: 'Công nghệ AI tiên tiến giúp chấm bài chính xác và nhanh chóng',
      color: '#0891b2'
    },
    {
      icon: '⚡',
      title: 'Tiết kiệm thời gian',
      description: 'Giảm 80% thời gian chấm bài so với phương pháp truyền thống',
      color: '#059669'
    },
    {
      icon: '📊',
      title: 'Phân tích chi tiết',
      description: 'Báo cáo và thống kê giúp theo dõi tiến độ học sinh',
      color: '#0284c7'
    },
    {
      icon: '🔒',
      title: 'Bảo mật cao',
      description: 'Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế',
      color: '#7c3aed'
    },
  ];

  const team = [
    { name: 'Nguyễn Văn A', role: 'CEO & Founder', avatar: '👨‍💼' },
    { name: 'Trần Thị B', role: 'CTO', avatar: '👩‍💻' },
    { name: 'Lê Văn C', role: 'Head of AI', avatar: '🧑‍🔬' },
    { name: 'Phạm Thị D', role: 'Product Manager', avatar: '👩‍💼' },
  ];

  return (
    <div className="about-page-new">
      {/* Hero Section */}
      <section className="about-hero">
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
            <span className="hero-badge">🚀 Về chúng tôi</span>
            <h1>Cách mạng hóa <span className="text-gradient">Giáo dục</span> với AI</h1>
            <p>GradingAI ra đời với sứ mệnh giúp giáo viên tiết kiệm thời gian chấm bài, đồng thời cung cấp phản hồi chi tiết và nhất quán cho học sinh.</p>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-icon">🎓</div>
              <div className="visual-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-new" style={{ '--accent': stat.color }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="mission-container">
          <div className="mission-header">
            <span className="section-badge">💡 Sứ mệnh của chúng tôi</span>
            <h2>Nâng cao chất lượng giáo dục Việt Nam</h2>
            <p>Chúng tôi tin rằng công nghệ AI có thể giúp giáo viên tập trung vào điều quan trọng nhất - truyền cảm hứng và hướng dẫn học sinh.</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ '--accent': feature.color }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="team-container">
          <div className="team-header">
            <span className="section-badge">👥 Đội ngũ</span>
            <h2>Những người đứng sau GradingAI</h2>
            <p>Đội ngũ giàu kinh nghiệm, đam mê công nghệ và giáo dục</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Sẵn sàng trải nghiệm?</h2>
            <p>Tham gia cùng hàng nghìn giáo viên đang sử dụng GradingAI</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                🚀 Bắt đầu ngay
              </button>
              <button className="btn-secondary" onClick={() => navigate('/contact')}>
                📞 Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2024 GradingAI. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default About;
