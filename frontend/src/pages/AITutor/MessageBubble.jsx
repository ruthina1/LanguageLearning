import React from 'react';
import { FaRobot } from 'react-icons/fa';
import './MessageBubble.css';

export default function MessageBubble({ message }) {
  if (!message) {
    return (
      <div className="message-bubble error">
        <div className="message-content">
          <p>Message not available</p>
        </div>
      </div>
    );
  }

  const { 
    id, 
    text, 
    sender, 
    created_at, 
    amharic_translation, 
    pronunciation_tips, 
    grammar_corrections 
  } = message;

  let cleanText = text;
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        cleanText = parsed.response || text;
      }
    } catch {
      cleanText = text;
    }
  }

  const isUser = sender === 'user';

  return (
    <div className={`message-group ${isUser ? 'user-group' : 'ai-group'}`}>
      <div className="message-wrapper">
        <div className="message-avatar">
          {isUser ? (
            <div className="user-avatar">U</div>
          ) : (
            <div className="ai-avatar">
              <FaRobot />
            </div>
          )}
        </div>
        <div className="message-content-wrapper">
          <div className={`message-content ${isUser ? 'user-message' : 'ai-message'}`}>
            <div className="message-text">
              {cleanText.split('\n').map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
              ))}
            </div>
            
            {(amharic_translation || pronunciation_tips || grammar_corrections) && (
              <div className="message-extras">
                {amharic_translation && (
                  <div className="extra-item">
                    <strong>Translation:</strong> {amharic_translation}
                  </div>
                )}
                {pronunciation_tips && (
                  <div className="extra-item">
                    <strong>Pronunciation:</strong> {pronunciation_tips}
                  </div>
                )}
                {grammar_corrections && (
                  <div className="extra-item">
                    <strong>Grammar:</strong> {grammar_corrections}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
