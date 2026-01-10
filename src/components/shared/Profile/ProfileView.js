import React from 'react';

const ProfileView = ({ userData, userType }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getRoleDisplay = () => {
    if (userType === 'teacher') {
      return { icon: '👨‍🏫', text: 'Giáo viên', color: '#0284c7' };
    }
    return { icon: '🎓', text: 'Học sinh', color: '#059669' };
  };

  const role = getRoleDisplay();

  // Skills data
  const skills = userType === 'teacher' 
    ? ['Toán học', 'Lập trình', 'AI/ML', 'Data Science']
    : ['Toán', 'Lý', 'Hóa', 'Tin học'];

  // Achievement badges
  const achievements = userType === 'teacher'
    ? [
        { icon: '⭐', label: 'Top giáo viên', color: '#d97706' },
        { icon: '🏆', label: '100+ bài chấm', color: '#7c3aed' },
        { icon: '💎', label: 'Premium', color: '#0284c7' },
      ]
    : [
        { icon: '🔥', label: 'Chăm chỉ', color: '#dc2626' },
        { icon: '⭐', label: 'Xuất sắc', color: '#d97706' },
        { icon: '🎯', label: 'Mục tiêu', color: '#059669' },
      ];

  return (
    <div className="profile-view-container">
      {/* Profile Header Card with Cover */}
      <div className="profile-main-card">
        {/* Cover Banner */}
        <div className="profile-cover">
          <div className="cover-pattern"></div>
          <div className="cover-overlay"></div>
        </div>

        <div className="profile-header-section">
          <div className="avatar-wrapper">
            <div className="avatar-ring">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar avatar-placeholder">
                  {getInitials(userData?.name)}
                </div>
              )}
            </div>
            <span className="status-dot"></span>
            <button className="avatar-edit-btn">📷</button>
          </div>
          
          <div className="profile-details">
            <h1 className="profile-name">{userData?.name || 'Người dùng'}</h1>
            <div className="profile-badges">
              <span className="profile-role" style={{ background: `${role.color}15`, color: role.color }}>
                {role.icon} {role.text}
              </span>
              <span className="profile-status online">🟢 Đang hoạt động</span>
            </div>
            <p className="profile-email">📧 {userData?.email || 'email@example.com'}</p>
            
            {/* Achievement Badges */}
            <div className="achievement-badges">
              {achievements.map((badge, index) => (
                <span key={index} className="achievement-badge" style={{ background: `${badge.color}15`, color: badge.color }}>
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon-wrapper blue">
              <span className="stat-icon">📚</span>
            </div>
            <span className="stat-value">{userType === 'teacher' ? '12' : '8'}</span>
            <span className="stat-name">{userType === 'teacher' ? 'Lớp học' : 'Khóa học'}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper purple">
              <span className="stat-icon">{userType === 'teacher' ? '👥' : '📝'}</span>
            </div>
            <span className="stat-value">{userType === 'teacher' ? '156' : '45'}</span>
            <span className="stat-name">{userType === 'teacher' ? 'Học sinh' : 'Bài tập'}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper yellow">
              <span className="stat-icon">{userType === 'teacher' ? '⭐' : '✅'}</span>
            </div>
            <span className="stat-value">{userType === 'teacher' ? '4.8' : '95%'}</span>
            <span className="stat-name">{userType === 'teacher' ? 'Đánh giá' : 'Hoàn thành'}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper green">
              <span className="stat-icon">📅</span>
            </div>
            <span className="stat-value">{userType === 'teacher' ? '5+' : '2+'}</span>
            <span className="stat-name">Năm</span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="profile-info-grid">
        {/* About Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="card-icon">💬</span>
            <h3>Giới thiệu</h3>
          </div>
          <p className="profile-bio">
            {userData?.bio || `Xin chào! Tôi là ${userType === 'teacher' ? 'giáo viên' : 'học sinh'} đam mê học tập và phát triển bản thân. Luôn sẵn sàng học hỏi và chia sẻ kiến thức với mọi người! 🚀`}
          </p>
          
          {/* Skills Tags */}
          <div className="skills-section">
            <span className="skills-label">🎯 Chuyên môn</span>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="card-icon">📋</span>
            <h3>Thông tin cá nhân</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">📱</span>
              <div className="info-content">
                <span className="info-label">Điện thoại</span>
                <span className="info-value">{userData?.phone || '0123 456 789'}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🎂</span>
              <div className="info-content">
                <span className="info-label">Ngày sinh</span>
                <span className="info-value">{userData?.birthDate || '20/08/1995'}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">👤</span>
              <div className="info-content">
                <span className="info-label">Giới tính</span>
                <span className="info-value">{userData?.gender || 'Nam'}</span>
              </div>
            </div>
            {userType === 'teacher' ? (
              <>
                <div className="info-item">
                  <span className="info-icon">🏫</span>
                  <div className="info-content">
                    <span className="info-label">Khoa</span>
                    <span className="info-value">{userData?.department || 'CNTT'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🎓</span>
                  <div className="info-content">
                    <span className="info-label">Bằng cấp</span>
                    <span className="info-value">{userData?.degree || 'Thạc sĩ'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">💼</span>
                  <div className="info-content">
                    <span className="info-label">Chuyên môn</span>
                    <span className="info-value">{userData?.specialization || 'AI & ML'}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="info-item">
                  <span className="info-icon">🏫</span>
                  <div className="info-content">
                    <span className="info-label">Trường</span>
                    <span className="info-value">{userData?.school || 'Chưa cập nhật'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📖</span>
                  <div className="info-content">
                    <span className="info-label">Lớp</span>
                    <span className="info-value">{userData?.grade || 'Chưa cập nhật'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🆔</span>
                  <div className="info-content">
                    <span className="info-label">Mã HS</span>
                    <span className="info-value">{userData?.studentId || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Activity Card */}
      <div className="profile-card activity-card">
        <div className="profile-card-header">
          <span className="card-icon">📊</span>
          <h3>Hoạt động gần đây</h3>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon" style={{ background: '#10b98120', color: '#10b981' }}>✓</span>
            <div className="activity-content">
              <span className="activity-text">
                {userType === 'teacher' ? 'Chấm xong 5 bài tập Toán lớp 12A1' : 'Hoàn thành bài tập Toán chương 3'}
              </span>
              <span className="activity-time">2 giờ trước</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon" style={{ background: '#0ea5e920', color: '#0ea5e9' }}>💬</span>
            <div className="activity-content">
              <span className="activity-text">
                {userType === 'teacher' ? 'Trả lời câu hỏi của học sinh' : 'Đặt câu hỏi cho giáo viên'}
              </span>
              <span className="activity-time">5 giờ trước</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>📚</span>
            <div className="activity-content">
              <span className="activity-text">
                {userType === 'teacher' ? 'Tạo bài kiểm tra mới' : 'Tham gia lớp học Vật lý'}
              </span>
              <span className="activity-time">1 ngày trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

