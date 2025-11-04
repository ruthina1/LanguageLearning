import React, { useState } from 'react';
import { useAITutor } from '../../contexts/AITutorContext';
import { 
  FaEdit, 
  FaSearch, 
  FaTrash, 
  FaCheck, 
  FaLightbulb 
} from 'react-icons/fa';
import './GrammarAssistant.css';

export default function GrammarAssistant() {
  const { analyzeGrammar, currentAnalysis, isProcessing } = useAITutor();
  const [text, setText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const exampleSentences = [
    "I goes to school yesterday.",
    "She don't like apples.",
    "We was happy to see you.",
    "He have two brothers.",
    "They plays football every day."
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    try {
      await analyzeGrammar(text);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Grammar analysis failed:', error);
      alert('Failed to analyze grammar. Please try again.');
    }
  };

  const handleExampleClick = (example) => {
    setText(example);
    setShowAnalysis(false);
  };

  const handleClear = () => {
    setText('');
    setShowAnalysis(false);
  };

  const displayText = (text, fieldType = 'general') => {
    if (!text) return '';
    
    if (typeof text === 'string' && !text.trim().startsWith('{') && !text.trim().startsWith('```')) {
      return text;
    }
    
    let textStr = String(text).trim();
    
    textStr = textStr.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
    
    if (textStr.startsWith('{')) {
      try {
        const parsed = JSON.parse(textStr);
        
        switch (fieldType) {
          case 'corrected':
            return parsed.correctedText || parsed.corrected_text || textStr;
          case 'explanation':
            return parsed.explanationEnglish || parsed.explanation_english || textStr;
          case 'feedback':
            return parsed.english || parsed.feedback || textStr;
          default:
            return parsed.correctedText || parsed.corrected_text || 
                   parsed.response || parsed.text || textStr;
        }
      } catch (e) {
        console.warn('⚠️ JSON parsing failed for:', textStr.substring(0, 100));
        const textMatch = textStr.match(/"correctedText"\s*:\s*"([^"]*)"/);
        if (textMatch && textMatch[1]) {
          return textMatch[1];
        }
      }
    }
    
    return textStr;
  };

  return (
    <div className="grammar-assistant">
      <div className="grammar-header">
        <h2><FaEdit /> Grammar Assistant</h2>
        <p>Get detailed grammar corrections with Amharic explanations</p>
      </div>

      <div className="grammar-input-section">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your English text here for grammar analysis..."
          className="grammar-textarea"
          rows={6}
        />
        
        <div className="action-buttons">
          <button 
            onClick={handleAnalyze}
            disabled={isProcessing || !text.trim()}
            className="analyze-btn"
          >
            {isProcessing ? 'Analyzing...' : <><FaSearch /> Analyze Grammar</>}
          </button>
          
          <button 
            onClick={handleClear}
            className="clear-btn"
          >
            <FaTrash /> Clear
          </button>
        </div>
      </div>

      <div className="example-sentences">
        <h4>Try these examples:</h4>
        <div className="example-chips">
          {exampleSentences.map((sentence, index) => (
            <button
              key={index}
              className="example-chip"
              onClick={() => handleExampleClick(sentence)}
            >
              {sentence}
            </button>
          ))}
        </div>
      </div>

      {showAnalysis && currentAnalysis && (
        <div className="grammar-analysis">
          <div className="analysis-header">
            <h3>Grammar Analysis</h3>
            <div className={`accuracy-badge ${currentAnalysis.is_perfect ? 'perfect' : 'needs-work'}`}>
              {currentAnalysis.is_perfect ? <><FaCheck /> Perfect!</> : <><FaEdit /> Needs Improvement</>}
            </div>
          </div>

          {/* Corrected Text */}
          <div className="corrected-text">
            <h4>Corrected Text:</h4>
            <div className="corrected-content">
              {displayText(currentAnalysis.corrected_text, 'corrected')}
            </div>
          </div>

          {/* Errors Section with Full Explanations */}
          {currentAnalysis.errors && currentAnalysis.errors.length > 0 && (
            <div className="errors-section">
              <h4>Errors Found ({currentAnalysis.errors.length}):</h4>
              {currentAnalysis.errors.map((error, index) => (
                <div key={index} className="error-item">
                  <div className="error-correction">
                    <span className="incorrect">"{displayText(error.original_text)}"</span>
                    <span className="correction-arrow">→</span>
                    <span className="correct">"{displayText(error.correction)}"</span>
                    <span className={`severity-badge ${error.severity}`}>
                      {error.severity} priority
                    </span>
                  </div>
                  
                  <div className="error-explanations">
                    <div className="explanation-block">
                      <h5>English Explanation:</h5>
                      <div className="explanation-content">
                        {displayText(error.explanation_english, 'explanation')}
                      </div>
                    </div>
                    
                    <div className="explanation-block">
                      <h5>Amharic Explanation:</h5>
                      <div className="explanation-content">
                        {displayText(error.explanation_amharic, 'explanation')}
                      </div>
                    </div>
                  </div>

                  {error.examples && error.examples.length > 0 && (
                    <div className="examples-section">
                      <h5>Correct Examples:</h5>
                      <div className="examples-list">
                        {error.examples.map((example, exIndex) => (
                          <div key={exIndex} className="example-item">
                            {displayText(example)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Overall Feedback */}
          <div className="overall-feedback">
            <h4>Overall Feedback:</h4>
            <div className="feedback-blocks">
              <div className="feedback-block">
                <h5>English Feedback:</h5>
                <div className="feedback-content">
                  {displayText(currentAnalysis.overall_feedback_english, 'feedback')}
                </div>
              </div>
              <div className="feedback-block">
                <h5>Amharic Feedback:</h5>
                <div className="feedback-content">
                  {displayText(currentAnalysis.overall_feedback_amharic, 'feedback')}
                </div>
              </div>
            </div>
          </div>

      
          {currentAnalysis.improvementTips && currentAnalysis.improvementTips.length > 0 && (
            <div className="improvement-tips">
              <h4><FaLightbulb /> Improvement Tips:</h4>
              <div className="tips-list">
                {currentAnalysis.improvementTips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <span className="tip-bullet">•</span>
                    <span className="tip-text">{displayText(tip.tip_text)}</span>
                    {tip.category && (
                      <span className="tip-category">{tip.category}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}