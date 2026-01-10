import React, { useState } from 'react';
import { Button } from '../../../ui/index.js';

const CreateAnnouncement = ({ onSave, onCancel, editData = null }) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    content: editData?.content || '',
    priority: editData?.priority || 'normal',
    sendEmail: editData?.sendEmail || false,
    attachments: editData?.attachments || []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề thông báo';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung thông báo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const announcement = {
        ...formData,
        id: editData?.id || Date.now(),
        createdAt: editData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onSave && onSave(announcement);
    }
  };

  return (
    <div className="create-announcement-container">
      <div className="form-header">
        <div className="header-icon">📢</div>
        <div className="header-info">
          <h2>{editData ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</h2>
          <p>Gửi thông báo đến tất cả học sinh trong lớp</p>
        </div>
      </div>

      <div className="form-body">
        {/* Basic Info Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h3>Thông tin thông báo</h3>
          </div>
          
          <div className="card-content">
            <div className="form-group">
              <label>Tiêu đề thông báo <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nhập tiêu đề thông báo..."
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Nội dung thông báo <span className="required">*</span></label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Nhập nội dung thông báo..."
                rows={6}
                className={errors.content ? 'error' : ''}
              />
              {errors.content && <span className="error-text">{errors.content}</span>}
            </div>

            <div className="form-group">
              <label>Mức độ ưu tiên</label>
              <div className="priority-options">
                <label className={`priority-option ${formData.priority === 'normal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={formData.priority === 'normal'}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  />
                  <span className="priority-dot normal"></span>
                  Bình thường
                </label>
                <label className={`priority-option ${formData.priority === 'medium' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  />
                  <span className="priority-dot medium"></span>
                  Trung bình
                </label>
                <label className={`priority-option ${formData.priority === 'high' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  />
                  <span className="priority-dot high"></span>
                  Quan trọng
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">📎</span>
            <h3>Tệp đính kèm</h3>
          </div>
          
          <div className="card-content">
            <div className="file-upload-area">
              <input
                type="file"
                id="attachment-upload"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="attachment-upload" className="upload-label">
                <div className="upload-icon">📁</div>
                <span>Kéo thả hoặc click để chọn file</span>
                <span className="upload-hint">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, hình ảnh</span>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="attachments-list">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button 
                      className="remove-file"
                      onClick={() => removeAttachment(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Options Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">⚙️</span>
            <h3>Tùy chọn gửi</h3>
          </div>
          
          <div className="card-content">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.sendEmail}
                onChange={(e) => handleChange('sendEmail', e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="option-text">
                <span className="option-label">Gửi email thông báo</span>
                <span className="option-desc">Gửi email đến tất cả học sinh trong lớp</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <Button variant="outline" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {editData ? '💾 Lưu thay đổi' : '📢 Đăng thông báo'}
        </Button>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
