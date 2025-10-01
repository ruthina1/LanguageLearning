// src/pages/Lessons/LessonPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLessonById } from '../../services/api';
import {
  FaHeadphones,
  FaBookOpen,
  FaClipboardList,
  FaLightbulb,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import './LessonPage.css';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  // Fetch lesson when `id` changes
  useEffect(() => {
    let mounted = true;
    const getLesson = async () => {
      setLoading(true);
      try {
        const data = await fetchLessonById(id);

        let parsed = null;
        try {
          parsed =
            typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        } catch (err) {
          console.error('Failed to parse lesson content JSON:', err);
        }

        if (!mounted) return;
        setLesson(data);
        setParsedContent(parsed);
        // reset answers/feedback when new lesson loads
        setAnswers({});
        setFeedback({});
      } catch (err) {
        console.error('Error fetching lesson:', err);
        if (!mounted) return;
        setLesson(null);
        setParsedContent(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    getLesson();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson || !parsedContent) return <p>Lesson not found</p>;

  // handlers
  const handleMCQAnswer = (qIndex, option, correctAnswer) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
    setFeedback((prev) => ({
      ...prev,
      [qIndex]: option === correctAnswer ? 'correct' : 'incorrect',
    }));
  };

  const handleFillAnswer = (qIndex, value, correctAnswer) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
    setFeedback((prev) => ({
      ...prev,
      [qIndex]:
        value.trim().toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect',
    }));
  };

  // navigation: use the same route pattern your App uses.
  // If your App route is "/lesson/:id" use "/lesson/". If it's "/lessons/:id" change accordingly.
  const currentId = parseInt(id, 10);
  const prevLessonId = currentId > 1 ? currentId - 1 : null;
  const nextLessonId = currentId + 1; // assumes IDs are continuous; you can enhance to validate via backend

  const goToLesson = (lessonId) => {
    // clear state right away to avoid showing old content while fetching
    setLesson(null);
    setParsedContent(null);
    setAnswers({});
    setFeedback({});
    setLoading(true);

    // IMPORTANT: use the same route path you registered in App.jsx
    // Most examples used "/lesson/:id" (singular). If your app used "/lessons/:id" change this string.
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="lesson-page">
      <div className="lesson-container">
        <div className="lesson-header">
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="lesson-description">{parsedContent.lesson_overview}</p>
        </div>

        <div className="lesson-content">
          {/* Instructions */}
          {parsedContent.instructions?.length > 0 && (
            <div className="lesson-section instructions-container">
              <h2>
                <FaClipboardList /> Instructions
              </h2>
              <ul>
                {parsedContent.instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Audio */}
          {parsedContent.audio_url && (
            <div className="lesson-section audio-container">
              <h2>
                <FaHeadphones /> Listening Practice
              </h2>
              <audio controls>
                <source src={parsedContent.audio_url} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {/* Transcript */}
          {parsedContent.transcript && (
            <div className="lesson-section transcript-container">
              <h2>
                <FaBookOpen /> Transcript
              </h2>
              <pre>{parsedContent.transcript}</pre>
            </div>
          )}

          {/* Vocabulary */}
          {parsedContent.vocabulary?.length > 0 && (
            <div className="lesson-section vocabulary-container">
              <h2>
                <FaBookOpen /> Vocabulary
              </h2>
              <ul>
                {parsedContent.vocabulary.map((v, idx) => (
                  <li key={idx}>
                    <strong>{v.word}:</strong> {v.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercises */}
          {parsedContent.exercises?.length > 0 && (
            <div className="lesson-section exercises-container">
              <h2>
                <FaClipboardList /> Exercises
              </h2>
              {parsedContent.exercises.map((ex, idx) => (
                <div key={idx} className="exercise">
                  <p>{ex.question}</p>

                  {ex.type === 'multiple_choice' && (
                    <div>
                      {ex.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleMCQAnswer(idx, opt, ex.answer)}
                          className={`option-btn ${
                            feedback[idx] === 'correct' && answers[idx] === opt
                              ? 'correct'
                              : feedback[idx] === 'incorrect' && answers[idx] === opt
                              ? 'incorrect'
                              : ''
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {ex.type === 'fill_in_the_blank' && (
                    <div>
                      <input
                        type="text"
                        value={answers[idx] || ''}
                        placeholder="Type your answer..."
                        onChange={(e) => handleFillAnswer(idx, e.target.value, ex.answer)}
                      />
                      {feedback[idx] && (
                        <span className={`feedback ${feedback[idx]}`}>
                          {feedback[idx] === 'correct' ? <FaCheck /> : <FaTimes />}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {parsedContent.tips?.length > 0 && (
            <div className="lesson-section tips-container">
              <h2>
                <FaLightbulb /> Tips
              </h2>
              <ul>
                {parsedContent.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="lesson-navigation">
          {prevLessonId ? (
            <button className="nav-button prev" onClick={() => goToLesson(prevLessonId)}>
              <FaArrowLeft /> Previous Lesson
            </button>
          ) : (
            <button className="nav-button prev" disabled>
              <FaArrowLeft /> Previous Lesson
            </button>
          )}

          <button className="nav-button next" onClick={() => goToLesson(nextLessonId)}>
            Next Lesson <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
