import React from 'react';

const NotificationList = ({
                            notifications,
                            unreadCount,
                            onMarkRead,
                            onMarkAllRead,
                            onDelete,
                            getTypeIcon // Prop này có thể được truyền từ cha, hoặc dùng fallback bên dưới
                          }) => {

  // Hàm format thời gian (giữ nguyên logic của bạn)
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm render Icon dựa trên Type (Map với các Enum của Backend)
  const renderIcon = (type) => {
    // Nếu component cha truyền hàm getTypeIcon thì ưu tiên dùng
    if (getTypeIcon) return getTypeIcon(type);

    // Logic fallback mặc định khớp với Backend
    switch (type) {
      case 'ASSIGNMENT':
        return '📝'; // Bài tập
      case 'SUBMISSION':
        return '📤'; // Nộp bài
      case 'GRADE':
        return '🏅'; // Điểm số
      case 'ANNOUNCEMENT':
        return '📢'; // Thông báo chung (Backend của bạn đang trả về loại này)
      case 'SYSTEM':
        return '⚙️'; // Hệ thống
      default:
        return '📌'; // Mặc định
    }
  };

  return (
      <div className="notification-dropdown">
        <div className="notification-header">
          <h4>🔔 Thông báo</h4>
          {unreadCount > 0 && (
              <button className="mark-all-read" onClick={onMarkAllRead}>
                Đánh dấu tất cả đã đọc
              </button>
          )}
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="empty-icon">📭</span>
                <p>Không có thông báo mới</p>
              </div>
          ) : (
              notifications.map(notification => (
                  <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'} priority-${notification.priority || 'normal'}`}
                      onClick={() => !notification.read && onMarkRead(notification.id)}
                  >
                    <div className="notification-icon-wrapper">
                <span className="type-icon">
                  {renderIcon(notification.type)}
                </span>
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">{notification.title}</p>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{formatTime(notification.timestamp)}</span>
                    </div>
                    <button
                        className="delete-notification"
                        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                        title="Xóa thông báo"
                    >
                      ✕
                    </button>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default NotificationList;