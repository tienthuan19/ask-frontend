import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/components/assignment.css';

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
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const loadAssignmentData = () => {
    const mockAssignment = {
      id: assignmentId,
      title: "Bài tập số 1: Toán học cơ bản",
      description: "Giải các bài tập về phép tính cơ bản và ứng dụng trong thực tế.",
      dueDate: "2024-01-20",
      maxScore: 10,
      timeLimit: 3600,
      requirements: [
        "Trình bày rõ ràng các bước giải",
        "Sử dụng đúng ký hiệu toán học",
        "Đưa ra kết luận cho mỗi bài",
        "File đính kèm phải có định dạng PDF hoặc DOCX"
      ],
      questions: [
        { id: 1, question: "Câu 1: Tính giá trị của biểu thức 2x + 3y khi x = 5, y = 2", points: 2 },
        { id: 2, question: "Câu 2: Giải phương trình bậc nhất: 3x - 7 = 14", points: 3 },
        { id: 3, question: "Câu 3: Tính diện tích và chu vi hình chữ nhật 12cm x 8cm", points: 3 },
        { id: 4, question: "Câu 4: Tính tỷ lệ phần trăm học sinh nữ trong lớp 30 học sinh, 18 nam", points: 2 }
      ]
    };
    
    setAssignment(mockAssignment);
    setTimeRemaining(mockAssignment.timeLimit);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setSubmissionFile(file);
      } else {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX hoặc TXT');
      }
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      alert('Vui lòng nhập nội dung bài làm');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      alert('Nộp bài thành công!');
      setTimeout(() => navigate('/student-dashboard'), 2000);
    }, 1500);
  };

  const handleAutoSubmit = () => {
    if (!isSubmitted) {
      alert('Hết thời gian! Bài làm sẽ được tự động nộp.');
      handleSubmit();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!assignment) {
    return (
      <div className="assignment-page loading">
        <div className="loading-spinner">Đang tải bài tập...</div>
      </div>
    );
  }

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
