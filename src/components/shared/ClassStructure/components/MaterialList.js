import React from 'react';
import { Button } from '../../../ui/index.js';

const MaterialList = ({ materials = [], onDelete, onDownload }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    const iconMap = {
      'pdf': '📕',
      'doc': '📘',
      'docx': '📘',
      'xls': '📗',
      'xlsx': '📗',
      'ppt': '📙',
      'pptx': '📙',
      'image': '🖼️',
      'video': '🎬',
      'audio': '🎵',
      'zip': '📦',
      'default': '📄'
    };
    return iconMap[type] || iconMap.default;
  };

  const getCategoryStyle = (category) => {
    const styles = {
      'lesson': { bg: '#dbeafe', color: '#1d4ed8', label: '📖 Bài giảng' },
      'exercise': { bg: '#fef3c7', color: '#d97706', label: '✏️ Bài tập' },
      'reference': { bg: '#dcfce7', color: '#16a34a', label: '📚 Tham khảo' },
      'exam': { bg: '#fee2e2', color: '#dc2626', label: '📝 Đề thi' },
      'other': { bg: '#f3e8ff', color: '#7c3aed', label: '📎 Khác' }
    };
    return styles[category] || styles.other;
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="material-list-container">
        <div className="list-header">
          <div className="header-icon">📚</div>
          <div className="header-info">
            <h2>Tài liệu lớp học</h2>
            <p>Quản lý tài liệu và học liệu</p>
          </div>
        </div>

        <div className="empty-state-card">
          <div className="empty-icon">📂</div>
          <h3>Chưa có tài liệu nào</h3>
          <p>Tải lên tài liệu để chia sẻ với học sinh trong lớp</p>
        </div>
      </div>
    );
  }

  return (
    <div className="material-list-container">
      <div className="list-header">
        <div className="header-icon">📚</div>
        <div className="header-info">
          <h2>Tài liệu lớp học</h2>
          <p>{materials.length} tài liệu</p>
        </div>
      </div>

      <div className="material-grid">
        {materials.map((material) => {
          const categoryStyle = getCategoryStyle(material.category);
          
          return (
            <div key={material.id} className="material-card">
              <div className="material-icon">
                {getFileIcon(material.fileType)}
              </div>
              
              <div className="material-info">
                <span 
                  className="category-badge"
                  style={{ background: categoryStyle.bg, color: categoryStyle.color }}
                >
                  {categoryStyle.label}
                </span>
                <h3 className="material-title">{material.title}</h3>
                {material.description && (
                  <p className="material-description">{material.description}</p>
                )}
                <div className="material-meta">
                  <span className="meta-item">
                    📅 {formatDate(material.uploadedAt)}
                  </span>
                  <span className="meta-item">
                    💾 {formatFileSize(material.fileSize)}
                  </span>
                </div>
              </div>
              
              <div className="material-actions">
                <button 
                  className="action-btn download"
                  onClick={() => onDownload && onDownload(material.id)}
                  title="Tải xuống"
                >
                  ⬇️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => onDelete && onDelete(material.id)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialList;
