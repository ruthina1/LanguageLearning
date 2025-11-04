// frontend/src/components/Lessons/ExerciseRenderer.jsx
import React, { useState } from 'react';
import VocabularyExercise from './ExerciseTypes/VocabularyExercise';
import SentenceExercise from './ExerciseTypes/SentenceExercise';
import ListeningExercise from './ExerciseTypes/ListeningExercise';
import SpeakingExercise from './ExerciseTypes/SpeakingExercise';

export default function ExerciseRenderer ({ exercise, onAnswerSubmit, exerciseNumber }) {
  const [showHint, setShowHint] = useState(false);

  const renderExercise = () => {
    switch (exercise.type) {
      case 'vocabulary':
        return (
          <VocabularyExercise
            exercise={exercise}
            onAnswerSubmit={onAnswerSubmit}
          />
        );
      case 'sentence':
        return (
          <SentenceExercise
            exercise={exercise}
            onAnswerSubmit={onAnswerSubmit}
          />
        );
      case 'listening':
        return (
          <ListeningExercise
            exercise={exercise}
            onAnswerSubmit={onAnswerSubmit}
          />
        );
      case 'speaking':
        return (
          <SpeakingExercise
            exercise={exercise}
            onAnswerSubmit={onAnswerSubmit}
          />
        );
      default:
        return <div>Exercise type not supported</div>;
    }
  };

  return (
    <div className="exercise-renderer">
      <div className="exercise-header">
        <h3>Exercise {exerciseNumber}</h3>
        {exercise.hint && (
          <button 
            className="hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            💡 Hint
          </button>
        )}
      </div>
      
      {showHint && exercise.hint && (
        <div className="hint-box">
          <p>{exercise.hint}</p>
        </div>
      )}
      
      {renderExercise()}
    </div>
  );
};


