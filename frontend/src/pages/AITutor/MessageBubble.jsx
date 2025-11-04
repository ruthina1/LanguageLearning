import React from 'react';
import './MessageBubble.css'

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

  return (
    <div className={`message-bubble ${sender === 'user' ? 'user-message' : 'tutor-message'}`}>
      <div className="message-header">
        <div className="message-avatar">
          {sender === 'user' ? '👤' : '🤖'}
        </div>
        <div className="message-info">
          <span className="message-sender">{sender === 'user' ? 'You' : 'ALEX'}</span>
          {created_at && (
            <span className="message-time">
              {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      <div className="message-content">
        <p>{cleanText}</p>

        {amharic_translation && (
          <div className="translation-content">
            <strong>Amharic:</strong> {amharic_translation}
          </div>
        )}

        {pronunciation_tips && (
          <div className="pronunciation-tips">
            <strong>Pronunciation:</strong> {pronunciation_tips}
          </div>
        )}

        {grammar_corrections && (
          <div className="grammar-notes">
            <strong>Grammar:</strong> {grammar_corrections}
          </div>
        )}
      </div>
    </div>
  );
}
