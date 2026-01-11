import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/components/assignment.css';
import {
  getAssignmentDetailAPI,
  getClassAssignmentsAPI,
  submitAssignmentAPI
} from '../../services/classManagerService.js';
import { formatDate, getDaysUntilDeadline, isOverdue } from '../../utils/dateHelpers.js';

// AssignmentHeader Component
const AssignmentHeader = ({ assignment, timeRemaining, formatTime }) => (
  <div className="assignment-header">
    <div className="header-left">
      <h1>{assignment.title}</h1>
      <div className="assignment-meta">
        <span className="due-date">📅 Hạn nộp: {assignment.dueDate}</span>
        <span className="max-score">⭐ Điểm tối đa: {assignment.maxScore}</span>
      </div>
    </div>
    <div className="header-right">
      {timeRemaining !== null && (
        <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
          ⏱️ Còn lại: {formatTime(timeRemaining)}
        </div>
      )}
    </div>
  </div>
);

// AssignmentDetails Component
const AssignmentDetails = ({ assignment }) => (
  <div className="assignment-details">
    <div className="description-section">
      <h3>📝 Mô tả bài tập</h3>
      <p>{assignment.description}</p>
    </div>
    
    <div className="requirements-section">
      <h3>📋 Yêu cầu</h3>
      <ul>
        {assignment.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </div>
    
    <div className="questions-section">
      <h3>❓ Câu hỏi</h3>
      {assignment.questions.map((q) => (
        <div key={q.id} className="question-item">
          <p>{q.question}</p>
          <span className="points">({q.points} điểm)</span>
        </div>
      ))}
    </div>
  </div>
);

// SubmissionForm Component
const SubmissionForm = ({
  submissionText,
  setSubmissionText,
  submissionFile,
  handleFileChange,
  handleSubmit,
  isSubmitting,
  isSubmitted
}) => (
  <div className="submission-form">
    <h3>✍️ Bài làm của bạn</h3>
    
    <textarea
      placeholder="Nhập nội dung bài làm..."
      value={submissionText}
      onChange={(e) => setSubmissionText(e.target.value)}
      disabled={isSubmitted}
      rows={10}
    />
    
    <div className="file-upload">
      <label>📎 Đính kèm file:</label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isSubmitted}
        accept=".pdf,.doc,.docx,.txt"
      />
      {submissionFile && (
        <span className="file-name">📄 {submissionFile.name}</span>
      )}
    </div>
    
    <button
      className="btn-submit"
      onClick={handleSubmit}
      disabled={isSubmitting || isSubmitted}
    >
      {isSubmitting ? '⏳ Đang nộp...' : isSubmitted ? '✅ Đã nộp' : '📤 Nộp bài'}
    </button>
  </div>
);

// Main AssignmentPage Component
const AssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!assignmentId) return;
      try {
        setLoading(true);
        const data = await getAssignmentDetailAPI(assignmentId);
        setAssignment(data);

        // Thiết lập timer: Backend trả về 'duration' (phút) -> đổi ra giây
        if (data.duration && data.duration > 0) {
          setTimeRemaining(data.duration * 60);
        }
      } catch (err) {
        console.error("Error loading assignment:", err);
        setError("Không thể tải nội dung bài tập.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);

  // 2. Timer Logic (Countdown)
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(); // Hết giờ tự nộp
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // 3. Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giới hạn dung lượng (ví dụ 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file dưới 10MB.");
        return;
      }
      setSubmissionFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSubmissionFile(null);
  };

  // 4. Submit Function
  const handleSubmit = async () => {
    if (!submissionText.trim() && !submissionFile) {
      alert('Vui lòng nhập nội dung bài làm hoặc đính kèm file!');
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn nộp bài không?")) {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        // Các trường này phải khớp với Backend (SubmissionRequest)
        formData.append('assignmentId', assignmentId);
        formData.append('content', submissionText);

        if (submissionFile) {
          formData.append('file', submissionFile);
        }

        await submitAssignmentAPI(formData);

        setIsSubmitted(true);
        alert('Nộp bài thành công!');

        // Sau khi nộp xong, quay lại dashboard sau 2s
        setTimeout(() => navigate('/student'), 2000);

      } catch (err) {
        console.error("Lỗi nộp bài:", err);
        alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
        setIsSubmitting(false);
      }
    }
  };

  const handleAutoSubmit = () => {
    if (!isSubmitted) {
      alert('Hết thời gian! Hệ thống sẽ tự động nộp bài làm hiện tại của bạn.');
      handleSubmit(); // Gọi submit ngay lập tức
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Loading / Error
  if (loading) return <div className="assignment-page loading"><div className="loading-spinner">⏳ Đang tải đề bài...</div></div>;
  if (error) return <div className="assignment-page error"><div className="error-message">❌ {error}</div></div>;
  if (!assignment) return null;

  return (
    <div className="assignment-page">
      <AssignmentHeader 
        assignment={assignment}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
      />

      <div className="assignment-content">
        <AssignmentDetails assignment={assignment} />
        
        <SubmissionForm
          submissionText={submissionText}
          setSubmissionText={setSubmissionText}
          submissionFile={submissionFile}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      </div>
    </div>
  );
};

export default AssignmentPage;
