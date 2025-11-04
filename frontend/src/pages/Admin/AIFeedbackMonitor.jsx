// frontend/src/components/Admin/AIFeedbackMonitor.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';


export default function AIFeedbackMonitor () {
  const { aiFeedbackLogs, getAIFeedbackAccuracy } = useAdmin();
  const [accuracyData, setAccuracyData] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadAccuracyData = async () => {
    const data = await getAIFeedbackAccuracy();
    setAccuracyData(data);
  };

  useEffect(() => {
    loadAccuracyData();
  }, []);

  const getFeedbackTypeIcon = (type) => {
    const icons = {
      grammar: '📝',
      pronunciation: '🎤',
      chat: '💬',
    };
    return icons[type] || '🤖';
  };

  return (
    <div className="ai-feedback-monitor">
      <div className="section-header">
        <h3>🤖 AI Feedback Monitor</h3>
        <button onClick={loadAccuracyData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {accuracyData && (
        <div className="accuracy-overview">
          <div className="accuracy-card">
            <div className="accuracy-value">{accuracyData.overallAccuracy}%</div>
            <div className="accuracy-label">Overall Accuracy</div>
          </div>
          <div className="accuracy-breakdown">
            <div className="breakdown-item">
              <span>Grammar: {accuracyData.grammarAccuracy}%</span>
            </div>
            <div className="breakdown-item">
              <span>Pronunciation: {accuracyData.pronunciationAccuracy}%</span>
            </div>
            <div className="breakdown-item">
              <span>Chat: {accuracyData.chatAccuracy}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="feedback-logs">
        <h4>Recent Feedback Logs</h4>
        <div className="logs-list">
          {aiFeedbackLogs.slice(0, 10).map((log) => (
            <div
              key={log.id}
              className={`log-item ${
                selectedLog?.id === log.id ? 'selected' : ''
              }`}
              onClick={() => setSelectedLog(log)}
            >
              <div className="log-header">
                <span className="log-type">
                  {getFeedbackTypeIcon(log.type)} {log.type}
                </span>
                <span className="log-time">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="log-preview">
                <strong>Input:</strong> {log.input.substring(0, 50)}...
              </div>
              {log.accuracy && (
                <div className="log-accuracy">
                  Accuracy: {Math.round(log.accuracy * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedLog && (
        <div className="log-detail">
          <h4>Feedback Detail</h4>
          <div className="detail-content">
            <div className="detail-section">
              <label>User Input:</label>
              <div className="detail-text">{selectedLog.input}</div>
            </div>
            <div className="detail-section">
              <label>AI Response:</label>
              <div className="detail-text">{selectedLog.output}</div>
            </div>
            <div className="detail-section">
              <label>Metadata:</label>
              <div className="detail-meta">
                <span>Type: {selectedLog.type}</span>
                <span>Time: {new Date(selectedLog.timestamp).toLocaleString()}</span>
                {selectedLog.accuracy && (
                  <span>Accuracy: {Math.round(selectedLog.accuracy * 100)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


