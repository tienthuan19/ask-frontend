import React, { useState, useEffect } from 'react';
import '../../styles/components/dashboard.css';
import {
  getDashboardStatsAPI,
  getTeacherClassesAPI,
  getClassAssignmentsAPI
} from '../../services/classManagerService.js';

function TeacherDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalClassrooms: 0,
    totalStudents: 0,
    totalAssignments: 0,
    averageScore: 0,
    completionRate: 0
  });

  const [classDetails, setClassDetails] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const basicStats = await getDashboardStatsAPI();

        if (basicStats) {
          setStats({
            totalClassrooms: basicStats.totalClassrooms || 0,
            totalStudents: basicStats.totalStudents || 0,
            totalAssignments: basicStats.totalAssignments || 0, // Lấy từ API
            averageScore: basicStats.averageScore || 0,         // Lấy từ API
            completionRate: basicStats.completionRate || 0      // Lấy từ API
          });
        }

        const classes = await getTeacherClassesAPI();

        const classesWithData = await Promise.all(classes.map(async (cls) => {
          try {
            const assignments = await getClassAssignmentsAPI(cls.id);
            return {
              ...cls,
              assignmentCount: assignments ? assignments.length : 0,
              avgScore: 0
            };
          } catch (err) {
            console.error(`Lỗi lấy bài tập lớp ${cls.name}`, err);
            return { ...cls, assignmentCount: 0, avgScore: 0 };
          }
        }));

        setClassDetails(classesWithData);

      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">⏳ Đang tải thống kê...</div>;
  }

  return (
      <div className="dashboard">
        <h2>📊 Dashboard Thống kê</h2>

        {/* Thống kê tổng quan */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{stats.totalClassrooms}</div>
            <div className="stat-label">Lớp học</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Học sinh</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalAssignments}</div>
            <div className="stat-label">Bài tập đã giao</div>
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
          <h3>📋 Chi tiết từng lớp</h3>
          {classDetails.length === 0 ? (
              <p>Chưa có lớp học nào.</p>
          ) : (
              classDetails.map((cls) => (
                  <div key={cls.id} className="class-stat-item">
                    <div className="class-info">
                      <strong>{cls.name}</strong>
                      <span className="class-sub-info">
                        {cls.subject} | Mã: {cls.classCode}
                      </span>
                    </div>

                    <div className="class-metrics">
                      <div className="metric-item">
                        <span className="metric-val">{cls.numberOfStudents || 0}</span>
                        <span className="metric-label">Học sinh</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val">{cls.assignmentCount}</span>
                        <span className="metric-label">Bài tập</span>
                      </div>
                      <div className="metric-item disabled">
                        <span className="metric-val">--</span>
                        <span className="metric-label">Điểm TB</span>
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default TeacherDashboard;