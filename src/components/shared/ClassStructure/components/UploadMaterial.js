import React, { useState, useRef } from 'react';
import { Button } from '../../../ui/index.js';

const UploadMaterial = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lesson',
    files: []
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'lesson', label: '📖 Bài giảng', desc: 'Slide, giáo án, nội dung bài học' },
    { value: 'exercise', label: '✏️ Bài tập', desc: 'Bài tập, worksheet, đề bài' },
    { value: 'reference', label: '📚 Tham khảo', desc: 'Tài liệu tham khảo, sách' },
    { value: 'exam', label: '📝 Đề thi', desc: 'Đề kiểm tra, đề thi mẫu' },
    { value: 'other', label: '📎 Khác', desc: 'Tài liệu khác' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: getFileType(file.name),
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
    return ext;
  };

  const removeFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const formatFileSize = (bytes) => {
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
      'zip': '📦'
    };
    return iconMap[type] || '📄';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề tài liệu';
    }
    if (formData.files.length === 0) {
      newErrors.files = 'Vui lòng chọn ít nhất một file';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const materials = formData.files.map(file => ({
        id: Date.now() + Math.random(),
        title: formData.files.length === 1 ? formData.title : `${formData.title} - ${file.name}`,
        description: formData.description,
        category: formData.category,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        file: file.file
      }));
      onSave && onSave(materials);
    }
  };

  return (
    <div className="upload-material-container">
      <div className="form-header">
        <div className="header-icon">📤</div>
        <div className="header-info">
          <h2>Tải tài liệu lên</h2>
          <p>Chia sẻ tài liệu học tập với học sinh</p>
        </div>
      </div>

      <div className="form-body">
        {/* Upload Area Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">📁</span>
            <h3>Chọn file tải lên</h3>
          </div>
          
          <div className="card-content">
            <div 
              className={`drop-zone ${dragActive ? 'active' : ''} ${errors.files ? 'error' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="drop-zone-content">
                <div className="upload-icon">
                  {dragActive ? '📥' : '📤'}
                </div>
                <p className="drop-text">
                  {dragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
                </p>
                <span className="drop-hint">
                  Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, hình ảnh, video
                </span>
              </div>
            </div>
            {errors.files && <span className="error-text">{errors.files}</span>}

            {formData.files.length > 0 && (
              <div className="files-list">
                <div className="files-header">
                  <span>📎 {formData.files.length} file đã chọn</span>
                </div>
                {formData.files.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-info">
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <button 
                      className="remove-file"
                      onClick={() => removeFile(file.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h3>Thông tin tài liệu</h3>
          </div>
          
          <div className="card-content">
            <div className="form-group">
              <label>Tiêu đề tài liệu <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nhập tiêu đề cho tài liệu..."
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Mô tả (tùy chọn)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Thêm mô tả về tài liệu..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Category Card */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon">🏷️</span>
            <h3>Phân loại tài liệu</h3>
          </div>
          
          <div className="card-content">
            <div className="category-grid">
              {categories.map((cat) => (
                <label 
                  key={cat.value}
                  className={`category-option ${formData.category === cat.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={(e) => handleChange('category', e.target.value)}
                  />
                  <div className="category-content">
                    <span className="category-label">{cat.label}</span>
                    <span className="category-desc">{cat.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <Button variant="outline" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          📤 Tải lên
        </Button>
      </div>
    </div>
  );
};

export default UploadMaterial;
