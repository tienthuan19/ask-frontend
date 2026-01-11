import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentTest from "./StudentTest.js";
import StudentCalendar from "./StudentCalendar.js";
import NotificationSystem from "../shared/NotificationSystem.js";
import ProfileComponent from "../shared/ProfileComponent.js";
import ClassDataManager from "../../services/classManagerService.js";
import "../../styles/globals.css";
import "../../styles/pages/student.css";

const Student = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("classes");
  const [activeClassTab, setActiveClassTab] = useState("assignments");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classCode, setClassCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [studentInfo, setStudentInfo] = useState({
    id: localStorage.getItem('studentId') || 'student_' + Date.now(),
    name: localStorage.getItem('userName') || "Nguyễn Văn A",
    studentId: "20251234",
    birthDate: "2003-05-12",
    gender: "Nam",
    email: localStorage.getItem('userEmail') || "student@email.com",
    avatar: "https://via.placeholder.com/100"
  });

  useEffect(() => {
    loadStudentClasses();
    if (!localStorage.getItem('studentId')) {
      localStorage.setItem('studentId', studentInfo.id);
    }
  }, []);

  const loadStudentClasses = () => {
    const studentId = localStorage.getItem('studentId') || studentInfo.id;
    const classes = ClassDataManager.getStudentClasses(studentId);
    setJoinedClasses(classes);
  };

  const handleViewClass = (classId) => {
    setSelectedClassId(classId);
    setActiveTab("classDetails");
    loadClassAssignments(classId);
  };

  const loadClassAssignments = (classId) => {
    const selectedClass = joinedClasses.find(c => c.id === classId);
    if (selectedClass && selectedClass.assignments) {
      setAssignments(selectedClass.assignments);
    }
  };

  const handleSearchClass = () => {
    if (classCode.trim() === '') {
      alert('Vui lòng nhập mã lớp học!');
      return;
    }
    const foundClass = ClassDataManager.findClassByCode(classCode.trim());
    if (foundClass) {
      setSearchResult(foundClass);
    } else {
      alert('Không tìm thấy lớp học với mã này!');
      setSearchResult(null);
    }
  };

  const handleJoinClass = async () => {
    if (!searchResult) return;
    setIsJoining(true);
    try {
      const studentId = localStorage.getItem('studentId') || studentInfo.id;
      const studentData = {
        id: studentId,
        name: studentInfo.name,
        email: studentInfo.email,
      };
      const result = ClassDataManager.joinClass(classCode.trim(), studentData);
      if (result.success) {
        loadStudentClasses();
        setClassCode('');
        setSearchResult(null);
        alert(`Tham gia lớp học "${result.class.name}" thành công!`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error joining class:', error);
      alert('Có lỗi xảy ra khi tham gia lớp học!');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('studentId');
    navigate("/", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const selectedClass = joinedClasses.find(c => c.id === selectedClassId);

  return (
    <div className="student-dashboard">
      {/* Navigation - Same style as Teacher */}
      <nav className="nav-modern">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">🎓</div>
            <span className="brand-text">GradingAI - Student</span>
          </div>
          <div className="nav-actions">
            <button 
              className={`nav-tab ${activeTab === "classes" ? "active" : ""}`}
              onClick={() => setActiveTab("classes")}
            >
              📚 Lớp học
            </button>
            <button 
              className={`nav-tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              📝 Bài tập
            </button>
            <button 
              className={`nav-tab ${activeTab === "calendar" ? "active" : ""}`}
              onClick={() => setActiveTab("calendar")}
            >
              📅 Lịch học
            </button>
            <button 
              className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Hồ sơ
            </button>
            <div className="notification-wrapper">
              <NotificationSystem 
                userRole="student" 
                classes={joinedClasses} 
                currentUser={studentInfo} 
              />
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Tab: Quản lý lớp học */}
      <div className={`content ${activeTab === "classes" ? "active" : ""}`}>
        <h2>📚 Quản lý lớp học</h2>
        
        {/* Join Class Section */}
        <div className="join-class-section">
          <h3>🔗 Tham gia lớp học mới</h3>
          <div className="join-class-form">
            <input
              type="text"
              placeholder="Nhập mã lớp học..."
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchClass()}
            />
            <button 
              className="btn-primary"
              onClick={handleSearchClass}
              disabled={!classCode.trim()}
            >
              🔍 Tìm kiếm
            </button>
          </div>

          {searchResult && (
            <div className="search-result">
              <div className="result-card">
                <div className="result-info">
                  <h4>{searchResult.name}</h4>
                  <p>👨‍🏫 Giáo viên: {searchResult.teacherName}</p>
                  <p>📖 Môn học: {searchResult.subject}</p>
                  <p>👥 Số học sinh: {searchResult.students?.length || 0}</p>
                </div>
                <div className="result-actions">
                  <button 
                    className="btn-primary"
                    onClick={handleJoinClass}
                    disabled={isJoining}
                  >
                    {isJoining ? '⏳ Đang xử lý...' : '✅ Tham gia'}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => { setSearchResult(null); setClassCode(''); }}
                  >
                    ❌ Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Classes List */}
        <div className="classes-section">
          <h3>📋 Danh sách lớp học ({joinedClasses.length})</h3>
          {joinedClasses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>Chưa có lớp học nào</h4>
              <p>Nhập mã lớp học ở trên để tham gia lớp học mới</p>
            </div>
          ) : (
            <div className="classes-grid">
              {joinedClasses.map((classItem) => (
                <div key={classItem.id} className="class-card">
                  <div className="class-card-header">
                    <h4>{classItem.name}</h4>
                    <span className="class-code">Mã: {classItem.code}</span>
                  </div>
                  <div className="class-card-body">
                    <p>👨‍🏫 {classItem.teacherName}</p>
                    <p>📖 {classItem.subject}</p>
                    <p>📝 {classItem.assignments?.length || 0} bài tập</p>
                  </div>
                  <div className="class-card-footer">
                    <button 
                      className="btn-primary"
                      onClick={() => handleViewClass(classItem.id)}
                    >
                      👁️ Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab: Bài tập */}
      <div className={`content ${activeTab === "pending" ? "active" : ""}`}>
        <StudentTest />
      </div>

      {/* Tab: Lịch học */}
      <div className={`content ${activeTab === "calendar" ? "active" : ""}`}>
        <StudentCalendar />
      </div>

      {/* Tab: Hồ sơ */}
      <div className={`content ${activeTab === "profile" ? "active" : ""}`}>
        <ProfileComponent
          userData={studentInfo}
          onUpdate={(updatedInfo) => {
            setStudentInfo(updatedInfo);
            localStorage.setItem('userName', updatedInfo.name);
            localStorage.setItem('userEmail', updatedInfo.email);
          }}
          onLogout={handleLogout}
          userType="student"
        />
      </div>

      {/* Tab: Chi tiết lớp học */}
      <div className={`content ${activeTab === "classDetails" ? "active" : ""}`}>
        <div className="class-details-header">
          <button className="btn-secondary" onClick={() => setActiveTab("classes")}>
            ← Quay lại
          </button>
          <div className="class-title-info">
            <h2>{selectedClass?.name || 'Chi tiết lớp học'}</h2>
            <span className="class-meta">Mã lớp: {selectedClass?.code} • {selectedClass?.subject}</span>
          </div>
        </div>

        <div className="class-tabs">
          <button 
            className={activeClassTab === "info" ? "active" : ""}
            onClick={() => setActiveClassTab("info")}
          >
            ℹ️ Thông tin
          </button>
          <button 
            className={activeClassTab === "assignments" ? "active" : ""}
            onClick={() => setActiveClassTab("assignments")}
          >
            📝 Bài tập ({assignments.length})
          </button>
          <button 
            className={activeClassTab === "materials" ? "active" : ""}
            onClick={() => setActiveClassTab("materials")}
          >
            📚 Tài liệu
          </button>
          <button 
            className={activeClassTab === "announcements" ? "active" : ""}
            onClick={() => setActiveClassTab("announcements")}
          >
            📢 Thông báo
          </button>
          <button 
            className={activeClassTab === "grades" ? "active" : ""}
            onClick={() => setActiveClassTab("grades")}
          >
            📊 Điểm số
          </button>
          <button 
            className={activeClassTab === "members" ? "active" : ""}
            onClick={() => setActiveClassTab("members")}
          >
            👥 Thành viên ({selectedClass?.students?.length || 0})
          </button>
        </div>

        {/* Tab: Thông tin lớp */}
        {activeClassTab === "info" && (
          <div className="class-info-section">
            <div className="info-card">
              <h3>📋 Thông tin lớp học</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Tên lớp</span>
                  <span className="info-value">{selectedClass?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mã lớp</span>
                  <span className="info-value">{selectedClass?.code}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Môn học</span>
                  <span className="info-value">{selectedClass?.subject}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giáo viên</span>
                  <span className="info-value">{selectedClass?.teacherName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số học sinh</span>
                  <span className="info-value">{selectedClass?.students?.length || 0}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số bài tập</span>
                  <span className="info-value">{selectedClass?.assignments?.length || 0}</span>
                </div>
              </div>
              {selectedClass?.description && (
                <div className="info-description">
                  <span className="info-label">Mô tả</span>
                  <p>{selectedClass.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Bài tập */}
        {activeClassTab === "assignments" && (
          <div className="assignments-section">
            {assignments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h4>Chưa có bài tập nào</h4>
                <p>Giáo viên chưa giao bài tập cho lớp này</p>
              </div>
            ) : (
              <div className="assignments-list">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="assignment-item">
                    <div className="assignment-info">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.description || 'Không có mô tả'}</p>
                      <div className="assignment-meta">
                        <span className="due-date">📅 Hạn nộp: {assignment.deadline || assignment.dueDate || 'Không có hạn'}</span>
                        {assignment.timeLimit && <span className="time-limit">⏱️ {assignment.timeLimit} phút</span>}
                        {assignment.maxScore && <span className="max-score">🎯 {assignment.maxScore} điểm</span>}
                      </div>
                    </div>
                    <div className="assignment-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => navigate(`/assignment/${assignment.id}`)}
                      >
                        ✏️ Làm bài
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Tài liệu */}
        {activeClassTab === "materials" && (
          <div className="materials-section">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4>Chưa có tài liệu nào</h4>
              <p>Giáo viên chưa tải lên tài liệu cho lớp này</p>
            </div>
          </div>
        )}

        {/* Tab: Thông báo */}
        {activeClassTab === "announcements" && (
          <div className="announcements-section">
            <div className="empty-state">
              <div className="empty-icon">📢</div>
              <h4>Chưa có thông báo nào</h4>
              <p>Giáo viên chưa đăng thông báo cho lớp này</p>
            </div>
          </div>
        )}

        {/* Tab: Điểm số */}
        {activeClassTab === "grades" && (
          <div className="grades-section">
            <div className="grades-card">
              <h3>📊 Bảng điểm của bạn</h3>
              {assignments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h4>Chưa có điểm số</h4>
                  <p>Bạn chưa có điểm số nào trong lớp này</p>
                </div>
              ) : (
                <div className="grades-table">
                  <div className="grades-header">
                    <span>Bài tập</span>
                    <span>Trạng thái</span>
                    <span>Điểm</span>
                  </div>
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="grades-row">
                      <span className="grade-title">{assignment.title}</span>
                      <span className="grade-status pending">Chưa nộp</span>
                      <span className="grade-score">--/{assignment.maxScore || 10}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Thành viên */}
        {activeClassTab === "members" && (
          <div className="members-section">
            <div className="members-card">
              <h3>👥 Danh sách thành viên</h3>
              
              {/* Giáo viên */}
              <div className="member-group">
                <h4>👨‍🏫 Giáo viên</h4>
                <div className="member-item teacher">
                  <div className="member-avatar">👨‍🏫</div>
                  <div className="member-info">
                    <span className="member-name">{selectedClass?.teacherName}</span>
                    <span className="member-role">Giáo viên phụ trách</span>
                  </div>
                </div>
              </div>

              {/* Học sinh */}
              <div className="member-group">
                <h4>👨‍🎓 Học sinh ({selectedClass?.students?.length || 0})</h4>
                {selectedClass?.students?.length === 0 ? (
                  <p className="no-members">Chưa có học sinh nào trong lớp</p>
                ) : (
                  <div className="members-list">
                    {selectedClass?.students?.map((student, index) => (
                      <div key={student.id} className="member-item">
                        <div className="member-avatar">{student.name?.charAt(0) || '?'}</div>
                        <div className="member-info">
                          <span className="member-name">{student.name}</span>
                          <span className="member-email">{student.email || 'Chưa có email'}</span>
                        </div>
                        {student.id === studentInfo.id && (
                          <span className="member-badge">Bạn</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Student;
