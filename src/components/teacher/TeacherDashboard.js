import React, { useState, useEffect } from 'react';
import '../../styles/components/dashboard.css';

function TeacherDashboard({ classes }) {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTests: 0,
    averageScore: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (classes && classes.length > 0) {
      const totalClasses = classes.length;
      const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
      const totalTests = classes.reduce((sum, cls) => sum + cls.tests.length, 0);
      
      // Tính điểm trung bình và tỉ lệ hoàn thành
      let totalScores = 0;
      let scoreCount = 0;
      let completedTests = 0;
      let totalPossibleTests = 0;

      classes.forEach(cls => {
        cls.students.forEach(student => {
          cls.tests.forEach(test => {
            totalPossibleTests++;
            if (student.scores && student.scores[test.id]) {
              const score = parseFloat(student.scores[test.id]);
              if (!isNaN(score)) {
                totalScores += score;
                scoreCount++;
                completedTests++;
              }
            }
          });
        });
      });

      const averageScore = scoreCount > 0 ? (totalScores / scoreCount) : 0;
      const completionRate = totalPossibleTests > 0 ? (completedTests / totalPossibleTests) * 100 : 0;

      setStats({
        totalClasses,
        totalStudents,
        totalTests,
        averageScore: averageScore.toFixed(1),
        completionRate: completionRate.toFixed(1)
      });
    }
  }, [classes]);

  // Dữ liệu cho biểu đồ (mock data cho demo)
  const getClassStats = () => {
    return classes.map(cls => {
      const avgScore = cls.students.reduce((sum, student) => {
        const scores = Object.values(student.scores || {}).filter(score => !isNaN(parseFloat(score)));
        const studentAvg = scores.length > 0 ? 
          scores.reduce((s, score) => s + parseFloat(score), 0) / scores.length : 0;
        return sum + studentAvg;
      }, 0) / (cls.students.length || 1);

      return {
        name: cls.name,
        avgScore: avgScore.toFixed(1),
        studentCount: cls.students.length,
        testCount: cls.tests.length
      };
    });
  };

  return (
    <div className="dashboard">
      <h2>Dashboard Thống kê</h2>
      
      {/* Thống kê tổng quan */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{stats.totalClasses}</div>
          <div className="stat-label">Lớp học</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Học sinh</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalTests}</div>
          <div className="stat-label">Bài kiểm tra</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.averageScore}</div>
          <div className="stat-label">Điểm TB</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completionRate}%</div>
          <div className="stat-label">Hoàn thành</div>
        </div>
      </div>

      {/* Thống kê từng lớp */}
      <div className="class-stats">
        <h3>Thống kê từng lớp</h3>
        {getClassStats().map((cls, idx) => (
          <div key={idx} className="class-stat-item">
            <div className="class-info">
              <strong>{cls.name}</strong>
              <span>{cls.studentCount} HS | {cls.testCount} bài kiểm tra</span>
            </div>
            <div className="class-score">
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ width: `${(cls.avgScore / 10) * 100}%` }}
                ></div>
              </div>
              <span>{cls.avgScore}/10</span>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ điểm số (đơn giản) */}
      <div className="score-chart">
        <h3>Phân bố điểm số</h3>
        <div className="chart-placeholder">
          <p>Biểu đồ phân bố điểm số theo lớp</p>
          <div className="simple-chart">
            {getClassStats().map((cls, idx) => (
              <div key={idx} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(cls.avgScore / 10) * 100}px` }}
                ></div>
                <span className="bar-label">{cls.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
