import React from 'react';

const WelcomeScreen = ({ selectedClass, onNavigate }) => {
  const stats = [
    { 
      icon: '👥', 
      label: 'Học sinh', 
      value: selectedClass.students?.length || 0,
      color: '#0891b2'
    },
    { 
      icon: '📝', 
      label: 'Bài tập', 
      value: selectedClass.assignments?.length || 0,
      color: '#7c3aed'
    },
    { 
      icon: '📢', 
      label: 'Thông báo', 
      value: 0,
      color: '#ea580c'
    },
    { 
      icon: '📚', 
      label: 'Tài liệu', 
      value: 0,
      color: '#059669'
    }
  ];

  const quickActions = [
    { 
      icon: '📝', 
      title: 'Xem bài tập', 
      desc: 'Quản lý danh sách bài tập',
      action: 'assignment-list',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      icon: '➕', 
      title: 'Tạo bài tập mới', 
      desc: 'Thêm bài tập cho lớp',
      action: 'create-assignment',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      icon: '👥', 
      title: 'Quản lý học sinh', 
      desc: 'Xem danh sách học sinh',
      action: 'student-list',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      icon: '📢', 
      title: 'Thông báo', 
      desc: 'Gửi thông báo cho lớp',
      action: 'announcement-list',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      icon: '📚', 
      title: 'Tài liệu', 
      desc: 'Quản lý tài liệu học tập',
      action: 'material-list',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      icon: '📤', 
      title: 'Tải tài liệu lên', 
      desc: 'Chia sẻ tài liệu mới',
      action: 'upload-material',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    }
  ];

  return (
    <div className="welcome-screen">
      {/* Hero Section */}
      <div className="welcome-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎓</span>
            <span>Lớp học trực tuyến</span>
          </div>
          <h1 className="hero-title">
            Chào mừng đến với lớp
            <span className="class-name">{selectedClass.name}</span>
          </h1>
          <div className="class-code-box">
            <span className="code-label">Mã lớp:</span>
            <span className="code-value">{selectedClass.code}</span>
            <button className="copy-btn" onClick={() => {
              navigator.clipboard.writeText(selectedClass.code);
              alert('Đã sao chép mã lớp!');
            }}>
              📋
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="illustration-circle">
            <span>🏫</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">
          <span className="title-icon">🚀</span>
          Hành động nhanh
        </h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className="action-card"
              onClick={() => onNavigate(action.action)}
            >
              <div className="action-icon" style={{ background: action.gradient }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
              <span className="action-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <div className="tip-card">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <h4>Mẹo sử dụng</h4>
            <p>Chia sẻ mã lớp <strong>{selectedClass.code}</strong> để học sinh có thể tham gia lớp học của bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
