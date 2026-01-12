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
    
    <div className="questions-section">
      <h3>❓ Câu hỏi</h3>
      {assignment.questions.map((q) => (
        <div key={q.id} className="question-item">
          <p>{q.content}</p>
          <span className="points">({q.score} điểm)</span>
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
  const [answersMap, setAnswersMap] = useState({});
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

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const handleAnswerChange = (questionId, value) => {
    setAnswersMap(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {

    const hasAnswer = Object.values(answersMap).some(ans => ans && ans.trim().length > 0);

    if (!hasAnswer) {
      if(!window.confirm("Bạn chưa nhập câu trả lời nào. Bạn có chắc chắn muốn nộp giấy trắng?")) {
        return;
      }
    } else {
      if (!window.confirm("Bạn có chắc chắn muốn nộp bài không?")) {
        return;
      }
    }

    setIsSubmitting(true);

    try {

      const answersPayload = assignment.questions.map(q => ({
        questionId: q.id,

        studentAnswer: answersMap[q.id] || ""

      }));

      const payload = {
        answers: answersPayload
      };

      await submitAssignmentAPI(assignmentId, payload);

      setIsSubmitted(true);
      alert('Nộp bài thành công!');
      setTimeout(() => navigate('/student-dashboard'), 2000);

    } catch (err) {
      console.error("Lỗi nộp bài:", err);
      const serverMsg = err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài.';
      alert('Lỗi: ' + serverMsg);
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    if (!isSubmitted) {
      alert('Hết thời gian! Hệ thống sẽ tự động nộp bài làm hiện tại của bạn.');
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        <div className="assignment-details">
          <div className="description-section">
            <h3>📝 Mô tả bài tập</h3>
            <p>{assignment.description || "Không có mô tả chi tiết."}</p>
          </div>
        </div>

        {/* --- DANH SÁCH CÂU HỎI & KHUNG TRẢ LỜI --- */}
        <div className="questions-container">
          {assignment.questions && assignment.questions.length > 0 ? (
              assignment.questions.map((q, index) => (
                  <div key={q.id} className="question-block" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>

                    {/* 1. Nội dung câu hỏi */}
                    <div className="question-header" style={{ marginBottom: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Câu hỏi {index + 1}:</h4>
                      <div className="question-content" style={{ fontSize: '1.1em', fontWeight: '500' }}>
                        {q.content}
                      </div>
                      <div className="question-score" style={{ marginTop: '5px', fontSize: '0.9em', color: '#666' }}>
                        (Điểm: {q.score})
                      </div>
                    </div>

                    {/* 2. Khung trả lời riêng cho từng câu */}
                    <div className="answer-area">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>
                        ✍️ Câu trả lời của bạn:
                      </label>
                      <textarea
                          className="answer-input"
                          rows={5}
                          placeholder={`Nhập câu trả lời cho câu ${index + 1}...`}
                          value={answersMap[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          disabled={isSubmitting || isSubmitted}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                      />
                    </div>
                  </div>
              ))
          ) : (
              <p>Bài tập này không có câu hỏi nào.</p>
          )}
        </div>

        {/* --- NÚT NỘP BÀI (Ở CUỐI TRANG) --- */}
        <div className="submission-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              style={{
                padding: '12px 30px',
                fontSize: '1.1em',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (isSubmitting || isSubmitted) ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || isSubmitted) ? 0.7 : 1
              }}
          >
            {isSubmitting ? '⏳ Đang nộp...' : isSubmitted ? '✅ Đã nộp thành công' : '📤 Nộp bài thi'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignmentPage;
