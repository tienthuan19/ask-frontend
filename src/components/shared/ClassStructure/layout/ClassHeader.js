import React from 'react';

const ClassHeader = ({ selectedClass, onBack }) => {
  return (
    <div className="class-header-compact">
      <button className="back-button" onClick={onBack}>
        <span className="back-icon">←</span>
        <span className="back-text">Quay lại</span>
      </button>
      
      <div className="header-center">
        <div className="class-badge">
          <span className="badge-icon">📚</span>
          <span className="class-name">{selectedClass.name}</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="code-chip">
          <span className="chip-label">Mã lớp</span>
          <span className="chip-value">{selectedClass.code}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
