// frontend/src/components/Lessons/ExerciseTypes/VocabularyExercise.jsx
import React, { useState } from 'react';

export default function VocabularyExercise ({ exercise, onAnswerSubmit }){
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === exercise.correctAnswer;
    setShowResult(true);
    
    setTimeout(() => {
      onAnswerSubmit({
        exerciseId: exercise.id,
        answer: selectedAnswer,
        correct: isCorrect,
        correctAnswer: exercise.correctAnswer
      });
      setShowResult(false);
      setSelectedAnswer('');
    }, 2000);
  };

  return (
    <div className="vocabulary-exercise">
      <div className="exercise-question">
        <h3>Translate this word:</h3>
        <div className="word-to-translate">{exercise.question}</div>
      </div>

      <div className="exercise-options">
        {exercise.options?.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${
              showResult ? (option === exercise.correctAnswer ? 'correct' : 'incorrect') : ''
            }`}
            onClick={() => !showResult && setSelectedAnswer(option)}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>

      {!showResult && (
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!selectedAnswer}
        >
          Check Answer
        </button>
      )}

      {showResult && (
        <div className={`result-feedback ${selectedAnswer === exercise.correctAnswer ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === exercise.correctAnswer ? (
            <div className="correct-feedback">
              ✅ Correct! Well done!
            </div>
          ) : (
            <div className="incorrect-feedback">
              ❌ The correct answer is: <strong>{exercise.correctAnswer}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

