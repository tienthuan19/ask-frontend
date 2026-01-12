import React, {useState} from 'react';
import { Button } from '../../../ui/index.js';

const CreateAssignment = ({
  show,
  formData,
  currentQuestion,
  onUpdateField,
  onUpdateQuestion,
  onAddQuestion,
  onRemoveQuestion,
  onCreate,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => { // Thêm async
    e.preventDefault();
    if (formData.title?.trim() && formData.questions?.length > 0) {
      setIsSubmitting(true); // Khóa nút
      try {
        const payload = {
          ...formData,
          // If formData still uses 'deadline', map it to 'dueDate'
          dueDate: formData.dueDate,
          // If formData uses 'timeLimit', map it to 'duration'
          duration: formData.duration
        };
        await onCreate(payload); // Chờ hàm cha xử lý API
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false); // Mở khóa (nếu form chưa đóng)
      }
    } else {
      alert('Vui lòng nhập tiêu đề và thêm ít nhất 1 câu hỏi!');
    }
  };

  return (
    <div className="create-assignment-container">
      {/* Header */}
      <div className="create-assignment-header">
        <div className="header-icon">📝</div>
        <div className="header-info">
          <h2>Tạo bài tập mới</h2>
          <p>Tạo bài tập cho lớp học của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-assignment-form">
        {/* Basic Info Card */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">📋</span>
            <h3>Thông tin cơ bản</h3>
          </div>
          
          <div className="form-card-body">
            <div className="form-group">
              <label>
                <span className="label-icon">📌</span>
                Tiêu đề bài tập <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => onUpdateField('title', e.target.value)}
                placeholder="VD: Bài tập chương 1 - Giới hạn và liên tục"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">📝</span>
                Mô tả bài tập
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => onUpdateField('description', e.target.value)}
                placeholder="Mô tả chi tiết về yêu cầu, nội dung bài tập..."
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">⚙️</span>
            <h3>Cài đặt bài tập</h3>
          </div>
          
          <div className="form-card-body">
            <div className="form-grid-3">
              <div className="form-group">
                <label>
                  <span className="label-icon">📅</span>
                  Hạn nộp bài
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate || ''}
                  onChange={(e) => onUpdateField('dueDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">⏱️</span>
                  Thời gian làm (phút)
                </label>
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => onUpdateField('duration', e.target.value)}
                  placeholder="60"
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">🏆</span>
                  Điểm tối đa
                </label>
                <input
                  type="number"
                  value={formData.maxScore || 100}
                  onChange={(e) => onUpdateField('maxScore', Number(e.target.value))}
                  className="form-input"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Card */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">❓</span>
            <h3>Câu hỏi</h3>
            <span className="question-count">{formData.questions?.length || 0} câu</span>
          </div>
          
          <div className="form-card-body">
            {/* Question Builder */}
            <div className="question-builder">
              <div className="form-group">
                <label>
                  <span className="label-icon">✏️</span>
                  Nội dung câu hỏi <span className="required">*</span>
                </label>
                <textarea
                  value={currentQuestion?.content || ''}
                  onChange={(e) => onUpdateQuestion('content', e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-row-2">
                {/*<div className="form-group">*/}
                {/*  <label>*/}
                {/*    <span className="label-icon">📊</span>*/}
                {/*    Loại câu hỏi*/}
                {/*  </label>*/}
                {/*  <select*/}
                {/*    value={currentQuestion?.type || 'essay'}*/}
                {/*    onChange={(e) => onUpdateQuestion('type', e.target.value)}*/}
                {/*    className="form-select"*/}
                {/*  >*/}
                {/*    <option value="essay">Tự luận</option>*/}
                {/*    <option value="short-answer">Trả lời ngắn</option>*/}
                {/*    <option value="file-upload">Nộp file</option>*/}
                {/*  </select>*/}
                {/*</div>*/}

                <div className="form-group">
                  <label>
                    <span className="label-icon">💯</span>
                    Điểm câu hỏi
                  </label>
                  <input
                    type="number"
                    value={currentQuestion?.score || 10}
                    onChange={(e) => onUpdateQuestion('score', Number(e.target.value))}
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">✅</span>
                  Đáp án mẫu (tùy chọn)
                </label>
                <textarea
                  value={currentQuestion?.modelAnswer || ''}
                  onChange={(e) => onUpdateQuestion('modelAnswer', e.target.value)}
                  placeholder="Đáp án mẫu để AI tham khảo khi chấm điểm..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <Button 
                type="button"
                variant="secondary"
                onClick={onAddQuestion}
                className="add-question-btn"
              >
                <span>➕</span> Thêm câu hỏi
              </Button>
            </div>

            {/* Questions List */}
            {formData.questions?.length > 0 && (
              <div className="questions-list">
                <h4>Danh sách câu hỏi đã thêm</h4>
                {formData.questions.map((q, index) => (
                  <div key={q.id} className="question-item">
                    <div className="question-number">{index + 1}</div>
                    <div className="question-content">
                      <p className="question-text">{q.content}</p>
                      <div className="question-meta">
                        <span className="meta-item">
                          📊 {q.type === 'essay' ? 'Tự luận' : q.type === 'short-answer' ? 'Trả lời ngắn' : 'Nộp file'}
                        </span>
                        <span className="meta-item">💯 {q.score} điểm</span>
                      </div>
                      {q.modelAnswer && (
                        <p className="sample-answer">
                          <strong>Đáp án mẫu:</strong> {q.modelAnswer}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="remove-question-btn"
                      onClick={() => onRemoveQuestion(q.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
          >
            ❌ Hủy bỏ
          </Button>
          <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Đang tạo...' : '✅ Tạo bài tập'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
