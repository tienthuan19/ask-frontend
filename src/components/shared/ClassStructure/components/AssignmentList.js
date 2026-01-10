import React from 'react';
import { Button } from '../../../ui/index.js';
import { formatDate, getDaysUntilDeadline, isOverdue } from '../../../../utils/dateHelpers.js';

const AssignmentList = ({ assignments = [], onDelete, onExtend }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="content-panel">
        <h3>📋 Danh sách bài tập</h3>
        <div className="empty-state">
          <span>📝</span>
          <p>Chưa có bài tập nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-panel">
      <h3>📋 Danh sách bài tập</h3>
      <div className="assignment-grid">
        {assignments.map(assignment => {
          const daysLeft = getDaysUntilDeadline(assignment.deadline);
          const overdue = isOverdue(assignment.deadline);
          
          return (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <h4>{assignment.title}</h4>
                <span className="assignment-status">📝</span>
              </div>
              
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-meta">
                <span>⏰ Deadline: {formatDate(assignment.deadline)}</span>
                <span>📊 Điểm tối đa: {assignment.maxScore}</span>
                <span>❓ Số câu hỏi: {assignment.questions?.length || 0}</span>
                
                {assignment.deadline && (
                  <span className={`deadline-status ${overdue ? 'overdue' : 'active'}`}>
                    {overdue 
                      ? '🔴 Đã quá hạn' 
                      : `🟢 Còn ${daysLeft} ngày`
                    }
                  </span>
                )}
              </div>
              
              <div className="assignment-actions">
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => onExtend(assignment.id)}
                >
                  ⏰ Gia hạn
                </Button>
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => onDelete(assignment.id)}
                >
                  🗑️ Xóa
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentList;
