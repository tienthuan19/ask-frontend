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

  classes.forEach(classItem => {
    if (classItem && classItem.assignments && Array.isArray(classItem.assignments)) {
      classItem.assignments.forEach(assignment => {

        if (!assignment) return;


        const dateStr = assignment.dueDate || assignment.deadline;


        if (!dateStr) return;

        const deadline = new Date(dateStr);


        if (isNaN(deadline.getTime())) return;

        const timeDiff = deadline - now;
        const hoursLeft = timeDiff / (1000 * 60 * 60);


        if (hoursLeft > 0 && hoursLeft <= 24) {
          notifications.push({
            id: `deadline-${assignment.id}`,
            type: 'deadline',
            priority: 'urgent',
            message: `Hạn chót bài tập "${assignment.title}" trong lớp ${classItem.name || 'Lớp học'} sắp hết hạn (còn ${Math.ceil(hoursLeft)} giờ)`,
            timestamp: new Date().toISOString(),
            read: false
          });
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
