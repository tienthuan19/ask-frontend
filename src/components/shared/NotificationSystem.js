import React, { useState, useEffect } from 'react';
import NotificationBadge from './NotificationSystem/NotificationBadge.js';
import NotificationList from './NotificationSystem/NotificationList.js';
import { getMyNotificationsAPI } from '../../services/classManagerService.js';
import {
  checkDeadlines,
  createNewAssignmentNotification,
  createSubmissionNotification,
  getPriorityIcon,
  getTypeIcon
} from './NotificationSystem/NotificationHelpers.js';
import '../../styles/components/notification.css';

const NotificationSystem = ({ userRole, classes, currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Thêm thông báo bài tập mới
  const addNewAssignmentNotification = (assignment, className) => {
    const newNotification = createNewAssignmentNotification(assignment, className);
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Thêm thông báo nộp bài
  const addSubmissionNotification = (studentName, assignmentTitle, className) => {
    const newNotification = createSubmissionNotification(studentName, assignmentTitle, className);
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Đánh dấu đã đọc
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Xóa thông báo
  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    if (!notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getMyNotificationsAPI();

        if (data && Array.isArray(data)) {
          // Map dữ liệu từ API (nếu cần thiết) để khớp với UI
          const apiNotifications = data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.content || n.message, // Backend có thể trả về 'content' hoặc 'message'
            timestamp: n.createdAt || new Date().toISOString(),
            read: n.read || false,
            type: n.type || 'system',
            priority: 'normal'
          }));

          // Cập nhật state
          setNotifications(prev => {
            // Có thể kết hợp với thông báo Local (deadline) nếu muốn
            // Ở đây ta ưu tiên hiển thị thông báo từ Server
            return apiNotifications;
          });

          // Đếm số lượng chưa đọc
          const count = apiNotifications.filter(n => !n.read).length;
          setUnreadCount(count);
        }
      } catch (error) {
        console.error("Không thể tải thông báo:", error);
      }
    };

    // Gọi lần đầu khi component mount
    fetchNotifications();

    // Thiết lập polling: Gọi lại mỗi 30 giây để check thông báo mới
    const intervalId = setInterval(fetchNotifications, 30000);

    return () => clearInterval(intervalId);
  }, []); // Dependency array rỗng để chạy 1 lần khi mount

  // Kiểm tra deadline định kỳ
  useEffect(() => {
    const deadlineNotifications = checkDeadlines(classes);
    if (deadlineNotifications.length > 0) {
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const newNotifications = deadlineNotifications.filter(n => !existingIds.includes(n.id));
        if (newNotifications.length > 0) {
          setUnreadCount(prevCount => prevCount + newNotifications.length);
        }
        return [...newNotifications, ...prev];
      });
    }

    // Kiểm tra mỗi giờ
    const interval = setInterval(() => checkDeadlines(classes), 3600000);
    return () => clearInterval(interval);
  }, [classes]);

  return (
    <div className="notification-system">
      <NotificationBadge 
        unreadCount={unreadCount}
        onClick={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onDelete={deleteNotification}
          getPriorityIcon={getPriorityIcon}
          getTypeIcon={getTypeIcon}
        />
      )}
    </div>
  );
};

// Export hook để các component khác có thể sử dụng
export const useNotifications = () => {
  const [notificationSystem, setNotificationSystem] = useState(null);

  const addNewAssignmentNotification = (assignment, className) => {
    if (notificationSystem) {
      notificationSystem.addNewAssignmentNotification(assignment, className);
    }
  };

  const addSubmissionNotification = (studentName, assignmentTitle, className) => {
    if (notificationSystem) {
      notificationSystem.addSubmissionNotification(studentName, assignmentTitle, className);
    }
  };

  return {
    setNotificationSystem,
    addNewAssignmentNotification,
    addSubmissionNotification
  };
};

export default NotificationSystem;
