import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/calendar.css';
// Import đúng file service (nhớ có đuôi .js)
import { getStudentPendingAssignmentsAPI } from '../../services/classManagerService.js';

function StudentCalendar({ joinedClasses = [] }) {
  // Đổi tên state thành assignments cho đúng ngữ nghĩa
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- 1. CALL API LẤY DANH SÁCH BÀI TẬP ---
  useEffect(() => {
    const fetchAllAssignments = async () => {
      if (!joinedClasses || joinedClasses.length === 0) {
        setUpcomingAssignments([]);
        return;
      }

      setLoading(true);
      try {
        const promises = joinedClasses.map(async (cls) => {
          try {
            // Gọi API lấy bài tập chưa nộp (pending)
            // Backend: ApiResponse<List<AssignmentResponse>>
            const assignments = await getStudentPendingAssignmentsAPI(cls.id);

            const safeAssignments = Array.isArray(assignments) ? assignments : [];

            // Map thêm thông tin lớp học vào object bài tập
            return safeAssignments.map(assignment => ({
              ...assignment,
              className: cls.name,
              classCode: cls.classCode,
              classId: cls.id
            }));
          } catch (err) {
            console.error(`Lỗi lấy bài tập lớp ${cls.name}:`, err);
            return [];
          }
        });

        const results = await Promise.all(promises);
        const allAssignments = results.flat();

        // Sắp xếp theo deadline (cái nào gấp nhất lên đầu)
        const sortedAssignments = allAssignments.sort((a, b) =>
            new Date(a.dueDate) - new Date(b.dueDate)
        );

        setUpcomingAssignments(sortedAssignments);
      } catch (error) {
        console.error("Lỗi tải lịch bài tập:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAssignments();
  }, [joinedClasses]);

  // --- 2. CÁC HÀM XỬ LÝ HIỂN THỊ ---

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;

    if (diff <= 0) return 'Đã quá hạn';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  const getPriorityClass = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;
    const hours = diff / (1000 * 60 * 60);

    if (hours <= 0) return 'overdue';
    if (hours <= 24) return 'urgent'; // Gấp: < 24h
    if (hours <= 72) return 'soon';   // Sắp tới: < 3 ngày
    return 'normal';
  };

  const handleDoAssignment = (assignment) => {
    // Điều hướng đến trang chi tiết bài tập để nộp bài
    navigate(`/assignment/${assignment.id}`);
  };

  if (loading) {
    return <div className="student-calendar">Đang tải danh sách bài tập...</div>;
  }

  return (
      <div className="student-calendar">
        <h2>📅 Lịch nộp bài tập</h2>

        {upcomingAssignments.length === 0 ? (
            <div className="no-tests">
              <p>🎉 Bạn không có bài tập nào cần nộp!</p>
            </div>
        ) : (
            <div className="tests-timeline">
              {upcomingAssignments.map(asm => (
                  <div key={asm.id} className={`test-item ${getPriorityClass(asm.dueDate)}`}>
                    <div className="test-info">
                      <div className="test-header">
                        {/* Hiển thị tên bài tập */}
                        <h4>{asm.title}</h4>
                        <span className="class-badge">{asm.className}</span>
                      </div>
                      <div className="test-details">
                        <div className="deadline-info">
                          <strong>⏰ Hạn nộp:</strong> {new Date(asm.dueDate).toLocaleString('vi-VN')}
                        </div>
                        <div className="time-remaining">
                          <strong>Còn lại:</strong>
                          <span className={isOverdue(asm.dueDate) ? 'overdue-text' : 'time-text'}>
                      {getTimeRemaining(asm.dueDate)}
                    </span>
                        </div>
                        {/* Nếu có giới hạn thời gian làm bài */}
                        {asm.duration && (
                            <div className="time-limit">
                              <strong>⏱️ Thời gian làm:</strong> {asm.duration} phút
                            </div>
                        )}
                        <div className="test-stats">
                          {/* Hiển thị điểm tối đa */}
                          <span>Điểm: {asm.maxScore || 10}</span>
                        </div>
                      </div>
                    </div>
                    <div className="test-actions">
                      {!isOverdue(asm.dueDate) ? (
                          <button
                              className="do-test-btn"
                              onClick={() => handleDoAssignment(asm)}
                          >
                            Làm Bài Ngay
                          </button>
                      ) : (
                          <button className="overdue-btn" disabled>Đã quá hạn</button>
                      )}
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* Thống kê nhanh */}
        <div className="quick-stats">
          <div className="stat-item urgent">
          <span className="number">
            {upcomingAssignments.filter(t => getPriorityClass(t.dueDate) === 'urgent').length}
          </span>
            <span className="label">Gấp (24h)</span>
          </div>
          <div className="stat-item soon">
          <span className="number">
            {upcomingAssignments.filter(t => getPriorityClass(t.dueDate) === 'soon').length}
          </span>
            <span className="label">Sắp tới (3 ngày)</span>
          </div>
          <div className="stat-item overdue">
          <span className="number">
            {upcomingAssignments.filter(t => getPriorityClass(t.dueDate) === 'overdue').length}
          </span>
            <span className="label">Quá hạn</span>
          </div>
        </div>
      </div>
  );
}

export default StudentCalendar;