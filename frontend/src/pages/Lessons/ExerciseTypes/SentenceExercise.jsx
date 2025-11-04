// frontend/src/components/Lessons/ExerciseTypes/SentenceExercise.jsx
import React, { useState } from 'react';

export default function SentenceExercise ({ exercise, onAnswerSubmit }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(
    exercise.question.split(' ').sort(() => Math.random() - 0.5)
  );
  const [showResult, setShowResult] = useState(false);

  const handleWordSelect = (word) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  const handleWordRemove = (word, index) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  const handleSubmit = () => {
    const userAnswer = selectedWords.join(' ');
    const isCorrect = userAnswer === exercise.correctAnswer;
    setShowResult(true);

    setTimeout(() => {
      onAnswerSubmit({
        exerciseId: exercise.id,
        answer: userAnswer,
        correct: isCorrect,
        correctAnswer: exercise.correctAnswer
      });
      setShowResult(false);
      resetExercise();
    }, 2000);
  };

  const resetExercise = () => {
    setSelectedWords([]);
    setAvailableWords(exercise.question.split(' ').sort(() => Math.random() - 0.5));
  };

  return (
    <div className="sentence-exercise">
      <div className="exercise-instruction">
        <h3>Arrange the words to form a correct sentence:</h3>
      </div>

      <div className="sentence-builder">
        <div className="selected-words-area">
          {selectedWords.map((word, index) => (
            <button
              key={`${word}-${index}`}
              className="word-chip"
              onClick={() => handleWordRemove(word, index)}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="available-words-area">
          {availableWords.map((word, index) => (
            <button
              key={`${word}-${index}`}
              className="word-option"
              onClick={() => handleWordSelect(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {!showResult && (
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedWords.length === 0}
        >
          Check Sentence
        </button>
      )}

      {showResult && (
        <div className={`result-feedback ${
          selectedWords.join(' ') === exercise.correctAnswer ? 'correct' : 'incorrect'
        }`}>
          {selectedWords.join(' ') === exercise.correctAnswer ? (
            <div className="correct-feedback">
              ✅ Perfect! "{exercise.correctAnswer}"
            </div>
          ) : (
            <div className="incorrect-feedback">
              ❌ Correct sentence: "<strong>{exercise.correctAnswer}</strong>"
            </div>
          )}
        </div>
      )}
    </div>
  );
};


