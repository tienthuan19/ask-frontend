import React, { useState, useEffect } from 'react';

function StudentTest() {
  const [joinCode, setJoinCode] = useState('');
  const [joinedClass, setJoinedClass] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const [availableClasses] = useState([
    {
      id: 1,
      name: 'Toán 12A1',
      code: 'MATH12A1',
      tests: [
        {
          id: 1,
          name: 'Kiểm tra chương 1',
          timeLimit: 30,
          questions: [
            {
              id: 1,
              question: 'Tính đạo hàm của f(x) = x²',
              options: ['f\'(x) = 2x', 'f\'(x) = x', 'f\'(x) = 2x²', 'f\'(x) = x²'],
              correctAnswer: 0,
              explanation: 'Đạo hàm của x² là 2x theo quy tắc đạo hàm cơ bản.'
            },
            {
              id: 2,
              question: 'Giới hạn của 1/x khi x tiến tới 0⁺ là?',
              options: ['+∞', '-∞', '0', '1'],
              correctAnswer: 0,
              explanation: 'Khi x tiến tới 0 từ phía dương, 1/x tiến tới +∞.'
            }
          ]
        },
        {
          id: 2,
          name: 'Kiểm tra chương 2',
          timeLimit: 45,
          questions: [
            {
              id: 1,
              question: 'Tích phân của 2x là?',
              options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
              correctAnswer: 0,
              explanation: 'Tích phân của 2x là x² + C.'
            }
          ]
        }
      ]
    }
  ]);

  const handleJoinClass = () => {
    const foundClass = availableClasses.find(cls => cls.code === joinCode.toUpperCase());
    if (foundClass) {
      setJoinedClass(foundClass);
      setJoinCode('');
    } else {
      alert('Mã lớp không tồn tại! Thử mã: MATH12A1');
    }
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setTestResult(null);
    setAnswers({});
    if (test.timeLimit) {
      setTimeRemaining(parseInt(test.timeLimit) * 60);
    }
  };

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  useEffect(() => {
    if (timeRemaining > 0 && selectedTest && !testResult) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && selectedTest && !testResult) {
      handleSubmitTest();
    }
  }, [timeRemaining, selectedTest, testResult]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitTest = () => {
    let correct = 0;
    const results = selectedTest.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        options: question.options
      };
    });

    setTestResult({
      score: (correct / selectedTest.questions.length) * 10,
      correct,
      total: selectedTest.questions.length,
      results
    });
  };

  // Render Join Class
  if (!joinedClass) {
    return (
      <div className="student-test">
        <h2>📝 Làm bài kiểm tra</h2>
        <div className="test-join-section">
          <h3>🔗 Tham gia lớp học để làm bài</h3>
          <div className="join-form">
            <input
              type="text"
              placeholder="Nhập mã lớp (VD: MATH12A1)..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinClass()}
            />
            <button className="btn-primary" onClick={handleJoinClass}>
              🔍 Tìm lớp
            </button>
          </div>
          <p className="hint-text">💡 Thử mã: MATH12A1</p>
        </div>
      </div>
    );
  }

  // Render Test List
  if (!selectedTest) {
    return (
      <div className="student-test">
        <div className="test-header">
          <button className="btn-secondary" onClick={() => setJoinedClass(null)}>
            ← Quay lại
          </button>
          <h2>📚 {joinedClass.name}</h2>
        </div>
        <div className="test-list-section">
          <h3>📋 Danh sách bài kiểm tra</h3>
          {joinedClass.tests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>Chưa có bài kiểm tra</h4>
              <p>Giáo viên chưa tạo bài kiểm tra cho lớp này</p>
            </div>
          ) : (
            <div className="test-grid">
              {joinedClass.tests.map(test => (
                <div key={test.id} className="test-card">
                  <h4>{test.name}</h4>
                  <div className="test-info">
                    <p>⏱️ Thời gian: {test.timeLimit} phút</p>
                    <p>❓ Số câu hỏi: {test.questions.length}</p>
                  </div>
                  <button className="btn-primary" onClick={() => handleSelectTest(test)}>
                    ✏️ Làm bài
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Test Result
  if (testResult) {
    return (
      <div className="student-test">
        <div className="test-result-section">
          <h2>📊 Kết quả bài kiểm tra</h2>
          <div className="result-summary">
            <div className="score-circle">
              <span className="score">{testResult.score.toFixed(1)}</span>
              <span className="max-score">/10</span>
            </div>
            <p className="result-text">
              Đúng {testResult.correct}/{testResult.total} câu
            </p>
          </div>
          <div className="result-details">
            <h3>📝 Chi tiết kết quả</h3>
            {testResult.results.map((result, index) => (
              <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-question">
                  <span className="result-status">{result.isCorrect ? '✅' : '❌'}</span>
                  <span>{result.question}</span>
                </div>
                <div className="result-answer">
                  <p>Đáp án của bạn: {result.options[result.userAnswer] || 'Chưa trả lời'}</p>
                  {!result.isCorrect && (
                    <p className="correct-answer">Đáp án đúng: {result.options[result.correctAnswer]}</p>
                  )}
                  <p className="explanation">💡 {result.explanation}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => { setSelectedTest(null); setTestResult(null); }}>
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Render Test Questions
  return (
    <div className="student-test">
      <div className="test-taking-section">
        <div className="test-taking-header">
          <h2>{selectedTest.name}</h2>
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        <div className="questions-list">
          {selectedTest.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <h4>Câu {index + 1}: {question.question}</h4>
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className={`option-item ${answers[question.id] === optIndex ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === optIndex}
                      onChange={() => handleAnswerChange(question.id, optIndex)}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="test-actions">
          <button className="btn-secondary" onClick={() => setSelectedTest(null)}>
            ❌ Hủy bài làm
          </button>
          <button className="btn-primary" onClick={handleSubmitTest}>
            ✅ Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentTest;
