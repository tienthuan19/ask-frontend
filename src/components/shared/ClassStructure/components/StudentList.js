import React, { useState } from 'react';
import { Button } from '../../../ui/index.js';

const StudentList = ({ students = [], onRemove, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', studentId: '' });

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email) {
      onAddStudent && onAddStudent({
        ...newStudent,
        id: Date.now().toString()
      });
      setNewStudent({ name: '', email: '', studentId: '' });
      setShowAddModal(false);
    }
  };

  if (!students || students.length === 0) {
    return (
      <div className="student-list-container">
        <div className="list-header">
          <div className="header-icon">👥</div>
          <div className="header-info">
            <h2>Danh sách học sinh</h2>
            <p>Quản lý học sinh trong lớp</p>
          </div>
        </div>

        <div className="empty-state-card">
          <div className="empty-illustration">
            <div className="empty-circle">
              <span>👥</span>
            </div>
          </div>
          <h3>Chưa có học sinh nào</h3>
          <p>Chia sẻ mã lớp để học sinh tham gia hoặc thêm học sinh thủ công</p>
          <button className="add-student-btn" onClick={() => setShowAddModal(true)}>
            <span>➕</span> Thêm học sinh
          </button>
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="add-student-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>➕ Thêm học sinh mới</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Họ và tên <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Nhập họ và tên..."
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    placeholder="Nhập email..."
                  />
                </div>
                <div className="form-group">
                  <label>Mã số sinh viên</label>
                  <input
                    type="text"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                    placeholder="Nhập MSSV..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Hủy</Button>
                <Button variant="primary" onClick={handleAddStudent}>Thêm học sinh</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="list-header">
        <div className="header-icon">👥</div>
        <div className="header-info">
          <h2>Danh sách học sinh</h2>
          <p>{students.length} học sinh</p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="list-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <span>➕</span> Thêm học sinh
        </button>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.map((student, index) => (
          <div key={student.id} className="student-card" style={{'--delay': `${index * 0.05}s`}}>
            <div className="card-header">
              <div 
                className="student-avatar"
                style={{ background: getAvatarColor(student.name) }}
              >
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} />
                ) : (
                  <span>{getInitials(student.name)}</span>
                )}
              </div>
              <div className="student-status online"></div>
            </div>
            
            <div className="card-body">
              <h4 className="student-name">{student.name}</h4>
              <div className="student-details">
                <div className="detail-item">
                  <span className="detail-icon">🎓</span>
                  <span>{student.studentId || 'Chưa có MSSV'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <button className="action-btn view" title="Xem chi tiết">
                👁️
              </button>
              <button className="action-btn message" title="Gửi tin nhắn">
                💬
              </button>
              <button 
                className="action-btn remove" 
                title="Xóa khỏi lớp"
                onClick={() => onRemove(student.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && searchTerm && (
        <div className="no-results">
          <span>🔍</span>
          <p>Không tìm thấy học sinh với từ khóa "{searchTerm}"</p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-student-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Thêm học sinh mới</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Họ và tên <span className="required">*</span></label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Nhập email..."
                />
              </div>
              <div className="form-group">
                <label>Mã số sinh viên</label>
                <input
                  type="text"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                  placeholder="Nhập MSSV..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Hủy</Button>
              <Button variant="primary" onClick={handleAddStudent}>Thêm học sinh</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
