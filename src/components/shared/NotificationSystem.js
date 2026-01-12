import React, { useState, useEffect } from 'react';
import NotificationBadge from './NotificationSystem/NotificationBadge.js';
import NotificationList from './NotificationSystem/NotificationList.js';
import {
  getMyNotificationsAPI,
  markNotificationReadAPI,
  getUnreadCountAPI
} from '../../services/notificationService.js';
import {
  getPriorityIcon,
  getTypeIcon
} from './NotificationSystem/NotificationHelpers.js';
import '../../styles/components/notification.css';

const NotificationSystem = ({ userRole, classes }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- HÀM HELPER: Lấy tiêu đề dựa trên loại thông báo ---
  const getTitleByType = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return 'Bài tập mới';
      case 'SUBMISSION': return 'Nộp bài';
      case 'GRADE': return 'Điểm số';
      case 'SYSTEM': return 'Hệ thống';
      case 'ANNOUNCEMENT': return 'Thông báo chung';
      default: return 'Thông báo';
    }
  };

  // --- LOGIC LẤY DỮ LIỆU TỪ API (Gộp chung thành 1 hàm) ---
  const fetchNotificationData = async () => {
    try {
      console.log("Đang gọi API lấy thông báo..."); // Debug log

      // 1. Gọi API lấy danh sách
      const response = await getMyNotificationsAPI();

      // 2. Gọi API lấy số lượng chưa đọc
      const countResponse = await getUnreadCountAPI();

      // Kiểm tra dữ liệu trả về từ API danh sách
      // Cấu trúc mong đợi: { status: 200, message: "...", data: [...] }
      const notificationList = response?.data || [];

      if (Array.isArray(notificationList)) {
        console.log("Dữ liệu nhận được:", notificationList); // Debug log: Xem dữ liệu thô

        const mappedNotifications = notificationList.map(n => ({
          id: n.id,
          title: getTitleByType(n.type),
          message: n.message || n.content, // Fallback nếu backend đổi tên trường
          timestamp: n.createdAt,

          // --- SỬA LỖI QUAN TRỌNG Ở ĐÂY ---
          // JSON backend trả về "read", không phải "isRead"
          read: n.read !== undefined ? n.read : n.isRead,

          type: n.type,
          priority: 'normal',
          relatedEntityId: n.relatedEntityId
        }));

        setNotifications(mappedNotifications);
      } else {
        console.warn("API trả về không phải là mảng:", response);
      }

      // Cập nhật số lượng chưa đọc
      if (countResponse && countResponse.data !== undefined) {
        setUnreadCount(countResponse.data);
      } else {
        // Fallback: tự đếm nếu API count lỗi
        if (Array.isArray(notificationList)) {
          const count = notificationList.filter(n => !n.read).length;
          setUnreadCount(count);
        }
      }

    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  // --- USE EFFECT: Gọi API khi component mount & Polling ---
  useEffect(() => {
    fetchNotificationData(); // Gọi ngay lần đầu

    // Polling mỗi 30 giây
    const intervalId = setInterval(fetchNotificationData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // --- HANDLER: Đánh dấu đã đọc ---
  const handleMarkAsRead = async (notificationId) => {
    // 1. Cập nhật UI ngay lập tức (Optimistic UI)
    setNotifications(prev =>
        prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // 2. Gọi API ngầm
    try {
      await markNotificationReadAPI(notificationId);
    } catch (error) {
      console.error("Lỗi API mark read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    const unreadNotifs = notifications.filter(n => !n.read);
    try {
      await Promise.all(unreadNotifs.map(n => markNotificationReadAPI(n.id)));
    } catch (error) {
      console.error("Lỗi mark all read:", error);
    }
  };

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
              // Refresh dữ liệu khi mở dropdown
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