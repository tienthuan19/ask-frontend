import React from 'react';

const AIVisual = () => {
  return (
    <div className="hero-visual-modern">
      <div className="visual-container">
        {/* AI Neural Network Background */}
        <div className="ai-background">
          <div className="neural-network">
            <svg className="neural-svg" viewBox="0 0 600 600">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              
              {/* Neural nodes */}
              <circle className="node node-1" cx="100" cy="150" r="8" />
              <circle className="node node-2" cx="150" cy="100" r="6" />
              <circle className="node node-3" cx="200" cy="180" r="7" />
              <circle className="node node-4" cx="250" cy="130" r="5" />
              <circle className="node node-5" cx="300" cy="200" r="8" />
              <circle className="node node-6" cx="350" cy="150" r="6" />
              <circle className="node node-7" cx="400" cy="220" r="7" />
              <circle className="node node-8" cx="450" cy="170" r="5" />
              
              {/* Neural connections */}
              <line className="connection conn-1" x1="100" y1="150" x2="150" y2="100" />
              <line className="connection conn-2" x1="150" y1="100" x2="200" y2="180" />
              <line className="connection conn-3" x1="200" y1="180" x2="250" y2="130" />
              <line className="connection conn-4" x1="250" y1="130" x2="300" y2="200" />
              <line className="connection conn-5" x1="300" y1="200" x2="350" y2="150" />
              <line className="connection conn-6" x1="350" y1="150" x2="400" y2="220" />
              <line className="connection conn-7" x1="400" y1="220" x2="450" y2="170" />
            </svg>
          </div>
          
          {/* Floating particles */}
          <div className="particles">
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
          </div>
        </div>

        {/* Main AI Brain/Core */}
        <div className="ai-core-card">
          <div className="ai-core">
            <div className="core-glow"></div>
            <div className="core-ring ring-1"></div>
            <div className="core-ring ring-2"></div>
            <div className="core-ring ring-3"></div>
            <div className="core-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path className="brain-icon" d="M9.5 2A2.5 2.5 0 0 0 7 4.5V7A2.5 2.5 0 0 0 9.5 9.5H12V7A2.5 2.5 0 0 1 14.5 4.5A2.5 2.5 0 0 1 17 7V9.5A2.5 2.5 0 0 1 14.5 12H12V14.5A2.5 2.5 0 0 0 14.5 17A2.5 2.5 0 0 0 17 14.5V12A2.5 2.5 0 0 0 14.5 9.5H12V7A2.5 2.5 0 0 0 9.5 4.5Z" stroke="url(#brainGradient)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="ai-status">
            <span className="status-dot"></span>
            <span className="status-text">AI Engine Active</span>
          </div>
        </div>

        {/* Floating Score Card */}
        <div className="floating-card score-card">
          <div className="card-glow"></div>
          <div className="score-header">
            <div className="score-badge">
              <div className="score-circle-ai">
                <svg className="score-ring" viewBox="0 0 100 100">
                  <circle className="ring-bg" cx="50" cy="50" r="45" />
                  <circle className="ring-progress" cx="50" cy="50" r="45" 
                          strokeDasharray="283" strokeDashoffset="56.6" />
                </svg>
                <div className="score-value">8.5</div>
              </div>
            </div>
            <div className="score-info">
              <span className="score-label">Điểm AI</span>
              <span className="score-grade">Xuất sắc</span>
            </div>
          </div>
        </div>

        {/* Processing Card */}
        <div className="floating-card processing-card">
          <div className="processing-content">
            <div className="processing-icon">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
              </svg>
            </div>
            <div className="processing-text">
              <span className="processing-title">AI đang phân tích</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="processing-bar">
            <div className="processing-fill"></div>
          </div>
        </div>

        {/* Insights Card */}
        <div className="floating-card insights-card">
          <div className="insights-header">
            <div className="insights-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Gợi ý thông minh</span>
          </div>
          <ul className="insights-list">
            <li className="insight-item">
              <span className="insight-icon">📚</span>
              <span>Bổ sung dẫn chứng lịch sử</span>
            </li>
            <li className="insight-item">
              <span className="insight-icon">✍️</span>
              <span>Cải thiện câu kết luận</span>
            </li>
          </ul>
        </div>

        {/* Data Flow Visualization */}
        <div className="data-flow">
          <div className="flow-line line-1"></div>
          <div className="flow-line line-2"></div>
          <div className="flow-line line-3"></div>
        </div>
      </div>
    </div>
  );
};

export default AIVisual;
