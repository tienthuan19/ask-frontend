// Notification helper functions

export const createNewAssignmentNotification = (assignment, className) => {
  return {
    id: Date.now(),
    type: 'assignment',
    priority: 'high',
    message: `Bài tập mới: ${assignment.title} trong lớp ${className}`,
    timestamp: new Date().toISOString(),
    read: false,
    assignment,
    className
  };
};

export const createSubmissionNotification = (studentName, assignmentTitle, className) => {
  return {
    id: Date.now(),
    type: 'submission',
    priority: 'normal',
    message: `${studentName} đã nộp bài ${assignmentTitle} trong lớp ${className}`,
    timestamp: new Date().toISOString(),
    read: false,
    studentName,
    assignmentTitle,
    className
  };
};

export const checkDeadlines = (classes) => {
  const now = new Date();
  const notifications = [];
  
  if (!classes || !Array.isArray(classes)) return notifications;
  
  classes.forEach(cls => {
    if (cls.assignments && Array.isArray(cls.assignments)) {
      cls.assignments.forEach(assignment => {
        if (assignment.dueDate) {
          const dueDate = new Date(assignment.dueDate);
          const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
          
          if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
            notifications.push({
              id: `deadline-${assignment.id || Date.now()}`,
              type: 'deadline',
              priority: 'urgent',
              message: `Bài tập "${assignment.title}" sắp đến hạn trong ${Math.round(hoursUntilDue)} giờ`,
              timestamp: new Date().toISOString(),
              read: false,
              assignment,
              className: cls.name
            });
          }
        }
      });
    }
  });
  
  return notifications;
};

export const getPriorityIcon = (priority) => {
  const icons = {
    urgent: '🔴',
    high: '🟠',
    normal: '🟡',
    low: '🟢'
  };
  return icons[priority] || '⚪';
};

export const getTypeIcon = (type) => {
  const icons = {
    assignment: '📝',
    submission: '📤',
    dueDate: '⏰',
    grade: '📊',
    message: '💬',
    system: '⚙️'
  };
  return icons[type] || '📢';
};
