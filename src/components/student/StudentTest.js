import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentClassesAPI, getStudentPendingAssignmentsAPI } from "../../services/classManagerService.js";

function StudentTest() {
  const navigate = useNavigate();

  // States
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classAssignments, setClassAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load danh sách lớp
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await getStudentClassesAPI();
        setJoinedClasses(response.data || []);
      } catch (err) {
        console.error("Lỗi tải lớp:", err);
      }
    };
    loadClasses();
  }, []);

  // 2. Load bài tập khi chọn lớp
  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    try {
      setIsLoading(true);
      const data = await getStudentPendingAssignmentsAPI(classItem.id);
      setClassAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải bài tập:", err);
      setClassAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xử lý khi bấm Làm bài -> CHUYỂN TRANG
  const handleStartTest = (assignmentId) => {
    // Điều hướng sang trang AssignmentPage với ID cụ thể
    navigate(`/assignment/${assignmentId}`);
  };

  // --- RENDER ---

  // Màn hình 1: Chọn lớp
  if (!selectedClass) {
    return (
        <div className="student-test">
          <h2>📝 Bài tập cần làm</h2>
          <div className="class-selection-section">
            {joinedClasses.length === 0 ? (
                <p>Bạn chưa tham gia lớp học nào.</p>
            ) : (
                <div className="class-grid-simple">
                  {joinedClasses.map(cls => (
                      <div key={cls.id} className="class-card-simple" onClick={() => handleSelectClass(cls)}>
                        <h4>{cls.name}</h4>
                        <p>Mã: {cls.classCode}</p>
                        <button className="btn-select">Xem bài tập</button>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
    );
  }

  // Màn hình 2: Danh sách bài tập của lớp
  return (
      <div className="student-test">
        <div className="test-header">
          <button className="btn-secondary" onClick={() => { setSelectedClass(null); setClassAssignments([]); }}>
            ← Chọn lớp khác
          </button>
          <h2>📚 {selectedClass.name}</h2>
        </div>

        <div className="test-list-section">
          {isLoading ? (
              <p>⏳ Đang tải danh sách...</p>
          ) : classAssignments.length === 0 ? (
              <div className="empty-state">
                <h4>Không có bài tập nào</h4>
                <p>Hiện tại bạn không có bài tập nào cần làm.</p>
              </div>
          ) : (
              <div className="test-grid">
                {classAssignments.map(assignment => (
                    <div key={assignment.id} className="test-card">
                      <h4>{assignment.title}</h4>
                      <div className="test-info">
                        <p>⏱️ Thời gian: {assignment.timeLimit ? `${assignment.timeLimit} phút` : 'Không giới hạn'}</p>
                        <p>📅 Hạn nộp: {assignment.deadline || 'Không có'}</p>
                      </div>
                      {/* Nút này sẽ gọi hàm navigate */}
                      <button
                          className="btn-primary"
                          onClick={() => handleStartTest(assignment.id)}
                      >
                        ✏️ Làm bài
                      </button>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

export default StudentTest;