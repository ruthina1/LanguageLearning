// frontend/src/components/Lessons/ExerciseTypes/ListeningExercise.jsx
import React, { useState, useRef } from 'react';

export default function ListeningExercise ({ exercise, onAnswerSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

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
    <div className="listening-exercise">
      <div className="exercise-instruction">
        <h3>Listen to the audio and select the correct translation:</h3>
      </div>

      <div className="audio-player">
        <audio
          ref={audioRef}
          src={exercise.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
        <button 
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlay}
          disabled={isPlaying}
        >
          {isPlaying ? '🔊 Playing...' : '🔊 Play Sound'}
        </button>
        
        <div className="playback-controls">
          <button onClick={() => audioRef.current?.play()}>▶️ Play</button>
          <button onClick={() => audioRef.current?.pause()}>⏸️ Pause</button>
          <button onClick={() => { if(audioRef.current){ audioRef.current.currentTime = 0; audioRef.current.play(); } }}>
            🔄 Repeat
          </button>
        </div>
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
            <div className="correct-feedback">✅ Excellent listening!</div>
          ) : (
            <div className="incorrect-feedback">
              ❌ Correct answer: <strong>{exercise.correctAnswer}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


