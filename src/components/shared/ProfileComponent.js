import React, { useState, useEffect } from 'react';
import { ProfileView, ProfileEdit, ProfileSettings } from './Profile/index.js';
import { Button } from '../ui/index.js';
import '../../styles/components/profile-new.css';

const ProfileComponent = ({ userData, onUpdate, onLogout, userType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData || {});
  const [activeSection, setActiveSection] = useState('basic');

  if (!userData) {
    return <div className="profile-modern">Loading...</div>;
  }

  useEffect(() => {
    setEditData(userData || {});
  }, [userData]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditData({ ...editData, avatar: imageUrl });
    }
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData || {});
    setIsEditing(false);
  };

  return (
    <div className="profile-page-wrapper">
      {!isEditing ? (
        <>
          <ProfileView userData={userData} userType={userType} />
          
          {/* Action Buttons */}
          <div className="profile-actions">
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              ✏️ Chỉnh sửa hồ sơ
            </Button>
            <Button variant="danger" onClick={onLogout}>
              🚪 Đăng xuất
            </Button>
          </div>
        </>
      ) : (
        <>
          <ProfileEdit 
            editData={editData}
            userData={userData}
            userType={userType}
            onFieldChange={handleChange}
            onAvatarChange={handleAvatarChange}
          />
          
          {/* Edit Action Buttons */}
          <div className="profile-actions">
            <Button variant="primary" onClick={handleSave}>
              💾 Lưu thay đổi
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              ❌ Hủy
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileComponent;
