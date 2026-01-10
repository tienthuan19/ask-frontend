import React from 'react';
import { Button } from '../../../ui/index.js';

const AnnouncementList = ({ announcements = [], onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: '#fee2e2', color: '#dc2626', label: '🔴 Quan trọng' };
      case 'medium':
        return { bg: '#fef3c7', color: '#d97706', label: '🟡 Trung bình' };
      default:
        return { bg: '#dcfce7', color: '#16a34a', label: '🟢 Bình thường' };
    }
  };

  if (!announcements || announcements.length === 0) {
    return (
      <div className="announcement-list-container">
        <div className="list-header">
          <div className="header-icon">📢</div>
          <div className="header-info">
            <h2>Thông báo lớp học</h2>
            <p>Quản lý các thông báo cho học sinh</p>
          </div>
        </div>

        <div className="empty-state-card">
          <div className="empty-icon">📭</div>
          <h3>Chưa có thông báo nào</h3>
          <p>Tạo thông báo mới để gửi đến học sinh trong lớp</p>
        </div>
      </div>
    );
  }

  return (
    <div className="announcement-list-container">
      <div className="list-header">
        <div className="header-icon">📢</div>
        <div className="header-info">
          <h2>Thông báo lớp học</h2>
          <p>{announcements.length} thông báo</p>
        </div>
      </div>

      <div className="announcement-list">
        {announcements.map((announcement) => {
          const priorityStyle = getPriorityStyle(announcement.priority);
          
          return (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <span 
                  className="priority-badge"
                  style={{ background: priorityStyle.bg, color: priorityStyle.color }}
                >
                  {priorityStyle.label}
                </span>
                <span className="announcement-date">
                  🕐 {formatDate(announcement.createdAt)}
                </span>
              </div>
              
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>
              
              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="announcement-attachments">
                  <span className="attachments-label">📎 Đính kèm:</span>
                  {announcement.attachments.map((file, idx) => (
                    <span key={idx} className="attachment-item">{file.name}</span>
                  ))}
                </div>
              )}
              
              <div className="announcement-actions">
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => onEdit && onEdit(announcement.id)}
                >
                  ✏️ Chỉnh sửa
                </Button>
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => onDelete && onDelete(announcement.id)}
                >
                  🗑️ Xóa
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementList;
