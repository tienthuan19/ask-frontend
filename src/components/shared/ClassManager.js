import React, {useState, useEffect, useCallback} from 'react';
import ClassStructure from './ClassStructure/index.js';
import '../../styles/globals.css';
import '../../styles/components/class-manager.css';
import {
  createClassAPI,
  getDashboardStatsAPI,
  getTeacherClassesAPI
} from "../../services/classManagerService.js";
import * as ClassService from "../../services/classManagerService.js";

function ClassManager() {
  // --- State Management ---
  const [classes, setClasses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalClassrooms: 0,
    totalStudents: 0
  });

  // Form State
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Loading & UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Selection State
  const [showClassStructure, setShowClassStructure] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // --- Data Loading Logic ---
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Gọi song song 2 API
      const [classesResponse, statsResponse] = await Promise.all([
        getTeacherClassesAPI(),
        getDashboardStatsAPI()
      ]);

      if (classesResponse && classesResponse.data) {
        // Map dữ liệu từ backend sang format UI
        // Backend trả về: numberOfStudents, numberOfAssignments
        const mappedClasses = classesResponse.data.map(cls => ({
          ...cls,
          code: cls.classCode || cls.code,
          // FIX: Tạo mảng giả cho cả students và assignments để tránh lỗi undefined length
          students: new Array(cls.numberOfStudents || 0).fill(null),
          assignments: new Array(cls.numberOfAssignments || 0).fill(null), // <-- THÊM DÒNG NÀY

          numberOfStudents: cls.numberOfStudents || 0,
          numberOfAssignments: cls.numberOfAssignments || 0,
          createdAt: cls.createdAt || new Date().toISOString()
        }));
        setClasses(mappedClasses);
      }

      if (statsResponse && statsResponse.data) {
        setDashboardStats(statsResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Helper sinh mã lớp ngẫu nhiên
  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // --- Handlers ---
  const handleAddClass = async () => {
    if (className.trim() === '' || classSubject.trim() === '') {
      alert('Vui lòng nhập đầy đủ tên lớp và môn học!');
      return;
    }

    setIsCreating(true);

    try {
      const newClassCode = generateClassCode();
      const payload = {
        code: newClassCode,
        name: className.trim(),
        subject: classSubject.trim(),
        description: classDescription.trim()
      };

      const response = await createClassAPI(payload);

      if (response && response.status === 200) {
        alert(`Tạo lớp học thành công!\nMã lớp: ${newClassCode}`);

        // Reset form
        setClassName('');
        setClassSubject('');
        setClassDescription('');
        setShowCreateForm(false);

        // Reload data
        await loadDashboardData();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo lớp học!';
      alert(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenClassStructure = (cls) => {
    setSelectedClass(cls);
    setShowClassStructure(true);
  };

  const handleBackToClassList = () => {
    setShowClassStructure(false);
    setSelectedClass(null);
    loadDashboardData(); // Refresh dữ liệu khi quay lại
  };

  const handleDeleteClass = (classId, className) => {
    // Placeholder cho chức năng xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"? (Chức năng này chưa có API)`)) {
      console.log("Delete requested for ID:", classId);
      alert("Chức năng xóa đang được phát triển.");
    }
  };

  const handleUpdateClass = (updatedClass) => {
    // Update local state tạm thời
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  // Hiển thị ClassStructure nếu được chọn
  if (showClassStructure && selectedClass) {
    return (
        <ClassStructure
            selectedClass={selectedClass}
            onBack={handleBackToClassList}
            onUpdateClass={handleUpdateClass}
        />
    );
  }

  return (
    <div className="class-manager-container">
      {/* Header Section */}
      <div className="manager-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Quản lý lớp học</h1>
            <p className="header-subtitle">Tạo và quản lý các lớp học của bạn</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-icon-box">🎓</div>
              <div className="stat-info">
                <span className="stat-number">{classes.length}</span>
                <span className="stat-text">Lớp học</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon-box">👨‍🎓</div>
              <div className="stat-info">
                <span className="stat-number">{classes.reduce((sum, cls) => sum + cls.students.length, 0)}</span>
                <span className="stat-text">Học sinh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Class Section */}
      <div className="create-section">
        {!showCreateForm ? (
          <button 
            className="btn-create-new"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Tạo lớp học mới</span>
          </button>
        ) : (
          <div className="create-form-card">
            <div className="form-header">
              <h3>Tạo lớp học mới</h3>
              <button 
                className="btn-close-form"
                onClick={() => {
                  setShowCreateForm(false);
                  setClassName('');
                  setClassSubject('');
                  setClassDescription('');
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="form-body">
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📚</span>
                  Tên lớp học
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="VD: Toán cao cấp A1"
                  maxLength={50}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📖</span>
                  Môn học
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={classSubject}
                  onChange={(e) => setClassSubject(e.target.value)}
                  placeholder="VD: Toán học, Văn học, Lịch sử..."
                  maxLength={30}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">📝</span>
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  className="form-textarea"
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  placeholder="Mô tả về lớp học..."
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="form-footer">
                <button 
                  onClick={handleAddClass}
                  disabled={isCreating}
                  className="btn-form-submit"
                >
                  {isCreating ? '⏳ Đang tạo...' : '✓ Tạo lớp học'}
                </button>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setClassName('');
                    setClassSubject('');
                    setClassDescription('');
                  }}
                  className="btn-form-cancel"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Classes Grid */}
      <div className="classes-grid-container">
        {classes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">Chưa có lớp học nào</h3>
            <p className="empty-description">Hãy tạo lớp học đầu tiên của bạn để bắt đầu!</p>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((cls, index) => (
              <div key={cls.id} className="class-item">
                <div className="class-header-section">
                  <div className="class-title-group">
                    <h3 className="class-title">{cls.name}</h3>
                    <span className="class-badge">{cls.subject}</span>
                  </div>
                  <div className="class-code-group">
                    <span className="code-text">{cls.code}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(cls.code);
                        alert('✓ Đã copy mã lớp!');
                      }}
                      className="btn-copy"
                      title="Copy mã lớp"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className="class-stats-section">
                  <div className="stat-card">
                    <span className="stat-emoji">👥</span>
                    <div className="stat-data">
                      <span className="stat-num">{cls.students.length}</span>
                      <span className="stat-label">Học sinh</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-emoji">📝</span>
                    <div className="stat-data">
                      <span className="stat-num">{cls.assignments.length}</span>
                      <span className="stat-label">Bài tập</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-emoji">📅</span>
                    <div className="stat-data">
                      <span className="stat-num">{new Date(cls.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</span>
                      <span className="stat-label">Ngày tạo</span>
                    </div>
                  </div>
                </div>

                {cls.description && (
                  <div className="class-desc-section">
                    <p>{cls.description}</p>
                  </div>
                )}

                <div className="class-actions-section">
                  <button 
                    onClick={() => handleOpenClassStructure(cls)}
                    className="btn-manage"
                  >
                    <span className="btn-icon">⚙️</span>
                    Quản lý
                  </button>
                  <button 
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="btn-delete"
                  >
                    <span className="btn-icon">🗑️</span>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassManager;