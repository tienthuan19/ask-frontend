import React from 'react';

const ProfileEdit = ({ editData, userData, userType, onFieldChange, onAvatarChange }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const currentAvatar = editData?.avatar || userData?.avatar;

  return (
    <div className="profile-view-container">
      {/* Main Card */}
      <div className="profile-main-card">
        {/* Cover Banner */}
        <div className="profile-cover">
          <div className="cover-pattern"></div>
          <div className="cover-overlay"></div>
        </div>

        <div className="profile-header-section">
          <div className="avatar-wrapper">
            <div className="avatar-ring">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar avatar-placeholder">
                  {getInitials(editData?.name || userData?.name)}
                </div>
              )}
            </div>
            <label htmlFor="avatar-input" className="avatar-edit-btn">📷</label>
            <input 
              type="file" 
              id="avatar-input"
              accept="image/*"
              onChange={onAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">✏️ Chỉnh sửa hồ sơ</h1>
            <p className="profile-email">Cập nhật thông tin cá nhân của bạn</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="edit-form-grid">
          <div className="form-field">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={editData?.name || ''}
              onChange={onFieldChange}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editData?.email || ''}
              onChange={onFieldChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-field">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={editData?.phone || ''}
              onChange={onFieldChange}
              placeholder="0123 456 789"
            />
          </div>

          <div className="form-field">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={editData?.birthDate || ''}
              onChange={onFieldChange}
            />
          </div>

          <div className="form-field">
            <label>Giới tính</label>
            <select
              name="gender"
              value={editData?.gender || ''}
              onChange={onFieldChange}
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {userType === 'teacher' && (
            <>
              <div className="form-field">
                <label>Khoa</label>
                <input
                  type="text"
                  name="department"
                  value={editData?.department || ''}
                  onChange={onFieldChange}
                  placeholder="VD: Công nghệ thông tin"
                />
              </div>

              <div className="form-field">
                <label>Bằng cấp</label>
                <input
                  type="text"
                  name="degree"
                  value={editData?.degree || ''}
                  onChange={onFieldChange}
                  placeholder="VD: Thạc sĩ, Tiến sĩ"
                />
              </div>

              <div className="form-field">
                <label>Kinh nghiệm</label>
                <input
                  type="text"
                  name="experience"
                  value={editData?.experience || ''}
                  onChange={onFieldChange}
                  placeholder="VD: 5 năm"
                />
              </div>
            </>
          )}

          {userType === 'student' && (
            <>
              <div className="form-field">
                <label>Trường</label>
                <input
                  type="text"
                  name="school"
                  value={editData?.school || ''}
                  onChange={onFieldChange}
                  placeholder="Tên trường học"
                />
              </div>

              <div className="form-field">
                <label>Lớp</label>
                <input
                  type="text"
                  name="grade"
                  value={editData?.grade || ''}
                  onChange={onFieldChange}
                  placeholder="VD: 12A1"
                />
              </div>

              <div className="form-field">
                <label>Mã học sinh</label>
                <input
                  type="text"
                  name="studentId"
                  value={editData?.studentId || ''}
                  onChange={onFieldChange}
                  placeholder="Nhập mã học sinh"
                />
              </div>
            </>
          )}

          <div className="form-field full-width">
            <label>Giới thiệu bản thân</label>
            <textarea
              name="bio"
              value={editData?.bio || ''}
              onChange={onFieldChange}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              rows="4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

