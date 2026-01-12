// src/components/shared/NotificationSystem.js
import React, { useState, useEffect } from 'react';
import NotificationBadge from './NotificationSystem/NotificationBadge.js';
import NotificationList from './NotificationSystem/NotificationList.js';
// Import service vừa tạo ở bước 1
import {
  getMyNotificationsAPI,
  markNotificationReadAPI,
  getUnreadCountAPI
} from '../../services/notificationService.js';
import {
  checkDeadlines,
  getPriorityIcon,
  getTypeIcon
} from './NotificationSystem/NotificationHelpers.js';
import '../../styles/components/notification.css';

const NotificationSystem = ({ userRole, classes }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- HÀM HELPER ĐỂ TẠO TIÊU ĐỀ TỪ TYPE ---
  // Vì backend không trả về title, ta tự sinh title dựa vào type
  const getTitleByType = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return 'Bài tập mới';
      case 'SUBMISSION': return 'Nộp bài';
      case 'GRADE': return 'Điểm số';
      case 'SYSTEM': return 'Hệ thống';
      default: return 'Thông báo';
    }
  };

  // --- LOGIC LẤY DỮ LIỆU TỪ API ---
  const fetchNotificationData = async () => {
    try {
      // 1. Lấy danh sách thông báo
      const notifResponse = await getMyNotificationsAPI();

      // 2. Lấy số lượng chưa đọc (Backend đã có endpoint riêng tối ưu hơn)
      const countResponse = await getUnreadCountAPI();

      if (notifResponse && notifResponse.data) {
        // Map dữ liệu từ Backend (NotificationResponse) sang Frontend
        const mappedNotifications = notifResponse.data.map(n => ({
          id: n.id,
          title: getTitleByType(n.type), // Tự sinh tiêu đề
          message: n.message,
          timestamp: n.createdAt,      // Backend trả về createdAt
          read: n.isRead,              // Backend trả về isRead
          type: n.type,
          priority: 'normal',          // Backend hiện chưa có priority, set mặc định
          relatedEntityId: n.relatedEntityId
        }));
        setNotifications(mappedNotifications);
      }

      if (countResponse && countResponse.data !== undefined) {
        setUnreadCount(countResponse.data);
      }

    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  // Gọi API khi component mount và polling mỗi 30s
  useEffect(() => {
    fetchNotificationData();
    const intervalId = setInterval(fetchNotificationData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // --- XỬ LÝ SỰ KIỆN ---

  // Đánh dấu đã đọc (Gọi API PUT)
  const handleMarkAsRead = async (notificationId) => {
    // 1. Cập nhật UI ngay lập tức (Optimistic UI update) để trải nghiệm mượt mà
    setNotifications(prev =>
        prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // 2. Gọi API ngầm bên dưới
    try {
      await markNotificationReadAPI(notificationId);
    } catch (error) {
      // Nếu lỗi, có thể revert lại state hoặc thông báo lỗi (tùy chọn)
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  // Đánh dấu tất cả đã đọc
  // Lưu ý: Backend bạn CHƯA CÓ endpoint "mark all read", nên ta phải loop hoặc chỉ update UI tạm thời.
  // Dưới đây là cách loop (không tối ưu lắm nhưng hoạt động với backend hiện tại)
  const handleMarkAllAsRead = async () => {
    // Update UI trước
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // Tìm các notif chưa đọc để gọi API
    const unreadNotifs = notifications.filter(n => !n.read);
    try {
      await Promise.all(unreadNotifs.map(n => markNotificationReadAPI(n.id)));
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả:", error);
    }
  };

  // Xóa thông báo (Chỉ xóa trên UI vì Backend chưa có API xóa)
  const handleDelete = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
      <div className="notification-system">
        <NotificationBadge
            unreadCount={unreadCount}
            onClick={() => {
              setShowNotifications(!showNotifications);
              // Nếu mở dropdown, có thể gọi lại API để refresh dữ liệu mới nhất
              if (!showNotifications) fetchNotificationData();
            }}
        />

        {showNotifications && (
            <NotificationList
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkRead={handleMarkAsRead}
                onMarkAllRead={handleMarkAllAsRead}
                onDelete={handleDelete}
                getPriorityIcon={getPriorityIcon}
                getTypeIcon={getTypeIcon}
            />
        )}
      </div>
  );
};

export default NotificationSystem;