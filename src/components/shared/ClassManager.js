import React, { useState, useEffect } from 'react';
import ClassStructure from './ClassStructure/index.js';
import ClassDataManager from '../../services/classDataManager.js';
import '../../styles/globals.css';
import '../../styles/components/class-manager.css';

function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [selectedClassIdx, setSelectedClassIdx] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [showClassStructure, setShowClassStructure] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load classes từ storage khi component mount
  useEffect(() => {
    loadTeacherClasses();
  }, []);

  const loadTeacherClasses = () => {
    // Lấy teacher ID từ localStorage hoặc tạm thời dùng fixed ID
    const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
    const teacherClasses = ClassDataManager.getTeacherClasses(teacherId);
    setClasses(teacherClasses);
  };

  // Tạo lớp học mới
  const handleAddClass = async () => {
    if (className.trim() === '' || classSubject.trim() === '') {
      alert('Vui lòng nhập đầy đủ tên lớp và môn học!');
      return;
    }

    setIsCreating(true);

    try {
      const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
      const teacherName = localStorage.getItem('userName') || 'Giáo viên';
      
      const classData = {
        name: className.trim(),
        subject: classSubject.trim(),
        description: classDescription.trim(),
        teacherName: teacherName
      };

      const newClass = ClassDataManager.createClass(classData, teacherId);
      
      if (newClass) {
        // Cập nhật danh sách lớp
        loadTeacherClasses();
        
        // Reset form
        setClassName('');
        setClassSubject('');
        setClassDescription('');
        setShowCreateForm(false);
        
        alert(`Tạo lớp học thành công!\nMã lớp: ${newClass.code}\nHãy chia sẻ mã này với học sinh để họ tham gia lớp.`);
      } else {
        alert('Lỗi khi tạo lớp học. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Có lỗi xảy ra khi tạo lớp học!');
    } finally {
      setIsCreating(false);
    }
  };

  // Chọn lớp để quản lý
  const handleSelectClass = (idx) => {
    setSelectedClassIdx(idx);
  };

  // Mở cấu trúc lớp học chi tiết
  const handleOpenClassStructure = (cls) => {
    setSelectedClass(cls);
    setShowClassStructure(true);
  };

  // Quay lại danh sách lớp
  const handleBackToClassList = () => {
    setShowClassStructure(false);
    setSelectedClass(null);
    loadTeacherClasses(); // Reload để cập nhật dữ liệu mới nhất
  };

  // Thêm học sinh vào lớp được chọn (thực tế học sinh sẽ tự tham gia bằng mã lớp)
  const handleAddStudent = () => {
    if (studentName.trim() !== '' && selectedClassIdx !== null) {
      const studentData = {
        id: 'student_' + Date.now(),
        name: studentName.trim(),
        email: '',
      };

      const classId = classes[selectedClassIdx].id;
      const result = ClassDataManager.joinClass(classes[selectedClassIdx].code, studentData);
      
      if (result.success) {
        loadTeacherClasses(); // Reload classes
        setStudentName('');
        alert('Thêm học sinh thành công!');
      } else {
        alert(result.message);
      }
    }
  };

  // Xóa lớp học
  const handleDeleteClass = (classId, className) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"?`)) {
      const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
      const success = ClassDataManager.deleteClass(classId, teacherId);
      
      if (success) {
        loadTeacherClasses();
        alert('Xóa lớp học thành công!');
      } else {
        alert('Lỗi khi xóa lớp học!');
      }
    }
  };

  // Cập nhật thông tin lớp học
  const handleUpdateClass = (updatedClass) => {
    const teacherId = localStorage.getItem('teacherId') || 'teacher_001';
    ClassDataManager.updateClass(updatedClass.id, updatedClass, teacherId);
    setSelectedClass(updatedClass);
    loadTeacherClasses(); // Reload để đồng bộ dữ liệu
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