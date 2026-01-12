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

  const fetchNotificationData = async () => {
    try {
      const response = await getMyNotificationsAPI();

      console.log("🔥 API Response Raw:", response);
      let notificationArray = [];


      if (response && Array.isArray(response.data)) {
        notificationArray = response.data;
      }

      else if (response && response.data && Array.isArray(response.data.data)) {
        notificationArray = response.data.data;
      }

      else if (Array.isArray(response)) {
        notificationArray = response;
      }

      console.log("✅ Extracted Array:", notificationArray); // DEBUG: Phải là mảng []

      if (Array.isArray(notificationArray)) {
        const mappedNotifications = notificationArray.map(n => ({
          id: n.id,
          title: getTitleByType(n.type),
          message: n.message || n.content,
          timestamp: n.createdAt,

          read: (n.read !== undefined) ? n.read : (n.isRead || false),

          type: n.type,
          priority: 'normal',
          relatedEntityId: n.relatedEntityId
        }));

        setNotifications(mappedNotifications);

        const count = mappedNotifications.filter(n => !n.read).length;
        setUnreadCount(count);
      }

    } catch (error) {
      console.error("❌ Lỗi khi tải thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotificationData();

    const intervalId = setInterval(fetchNotificationData, 30000);
    return () => clearInterval(intervalId);
  }, []);


  const handleMarkAsRead = async (notificationId) => {

    setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await markNotificationReadAPI(notificationId);
    } catch (error) {
      console.error("Lỗi mark read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    const unreadNotifs = notifications.filter(n => !n.read);
    try {
      await Promise.all(unreadNotifs.map(n => markNotificationReadAPI(n.id)));
    } catch (error) { console.error("Lỗi mark all:", error); }
  };

  const handleDelete = (notificationId) => {
    const notif = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
      <div className="notification-system">
        <NotificationBadge
            unreadCount={unreadCount}
            onClick={() => {
              setShowNotifications(!showNotifications);

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