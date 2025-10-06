import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLessonById, getUserProgress, updateUserProgress, fetchLessons } from '../../services/api';
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
  const [courseData, setCourseData] = useState([]);
  const [levelProgress, setLevelProgress] = useState({});
  const [lastLessonInLevel, setLastLessonInLevel] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const exerciseRefs = useRef({});
  const submitBtnRef = useRef(null);

  useEffect(() => {
    const getCourseTree = async () => {
      try {
        const res = await fetchLessons();
        setCourseData(res.courseData || []);
      } catch (err) {
        console.error('Error fetching course tree:', err);
      }
    };
    getCourseTree();
  }, []);

  useEffect(() => {
    let mounted = true;
    const getLesson = async () => {
      setLoading(true);
      try {
        const data = await fetchLessonById(id);
        let parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        if (!mounted) return;

        setLesson(data);
        setParsedContent(parsed);

        if (levelProgress[data.id]) {
          setAnswers(levelProgress[data.id].answers);
          setFeedback(levelProgress[data.id].feedback);
        } else {
          setAnswers({});
          setFeedback({});
        }

        const levelLessons = courseData.find(l => l.level === data.level)?.skills || [];
        setLastLessonInLevel(levelLessons[levelLessons.length - 1]?.id === data.id);

        setAllCorrect(false);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        if (!mounted) return;
        setLesson(null);
        setParsedContent(null);
        setLastLessonInLevel(false);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    getLesson();
    return () => { mounted = false; };
  }, [id, courseData, levelProgress]);

  useEffect(() => {
    if (!parsedContent?.exercises) return;

    const allCorrectNow = parsedContent.exercises.every((ex, idx) => {
      const ans = answers[idx];

      if (ex.type === 'multiple_choice') {
        return ans === ex.answer;
      }

      // FIXED: Check for both possible type names
      if (ex.type === 'fill_in_the_blank' || ex.type === 'fill_in_blank') {
        return ans?.trim().toLowerCase() === ex.answer.toLowerCase();
      }

      if (ex.type === 'matching') {
        // Handle both array and object formats for pairs
        const pairs = Array.isArray(ex.pairs) ? ex.pairs : Object.entries(ex.pairs || {});
        return pairs.every((pair, pIdx) => answers[`${idx}-${pIdx}`] === pair[1]);
      }

      return false;
    });

    setAllCorrect(allCorrectNow);
  }, [answers, parsedContent]);

  const getCompletedLessonsSet = () => {
    const localProgress = JSON.parse(localStorage.getItem('userProgress')) || { lessons_completed: [] };
    const feedbackProgress = Object.keys(levelProgress)
      .filter(id => {
        const f = levelProgress[id]?.feedback || {};
        return Object.values(f).every(v => v === 'correct');
      });

    return new Set([...localProgress.lessons_completed, ...feedbackProgress]);
  };

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson || !parsedContent) return <p>Lesson not found</p>;

  const handleMCQAnswer = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleFillAnswer = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmitAnswers = () => {
    const newFeedback = {};
    parsedContent.exercises.forEach((ex, idx) => {
      let isCorrect = false;

      if (ex.type === 'multiple_choice') {
        const value = answers[idx] || '';
        isCorrect = value === ex.answer;
      } 
      // FIXED: Handle both fill_in_blank types
      else if ((ex.type === 'fill_in_the_blank' || ex.type === 'fill_in_blank') && typeof ex.answer === 'string') {
        const value = answers[idx] || '';
        isCorrect = value.trim().toLowerCase() === ex.answer.toLowerCase();
      } 
      else if (ex.type === 'matching') {
        const pairs = Array.isArray(ex.pairs) ? ex.pairs : Object.entries(ex.pairs || {});
        isCorrect = pairs.every((pair, pIdx) => answers[`${idx}-${pIdx}`] === pair[1]);
      }

      newFeedback[idx] = isCorrect ? 'correct' : 'incorrect';
    });

    setFeedback(newFeedback);
    setLevelProgress(prev => ({ ...prev, [lesson.id]: { answers, feedback: newFeedback } }));

    const allCorrectNow = Object.values(newFeedback).every(v => v === 'correct');
    if (allCorrectNow) {
      const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
      const completed = new Set(userProgress.lessons_completed || []);
      completed.add(lesson.id);
      localStorage.setItem('userProgress', JSON.stringify({
        ...userProgress,
        lessons_completed: Array.from(completed),
      }));
    }

    const firstIncorrect = Object.entries(newFeedback).find(([_, v]) => v === 'incorrect');
    if (firstIncorrect) {
      const idx = parseInt(firstIncorrect[0], 10);
      exerciseRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      submitBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFinishLevel = async () => {
    if (!lesson) return;

    const levelLessons = courseData.find(l => l.level === lesson.level)?.skills || [];
    const completedLessonsSet = getCompletedLessonsSet();
    levelLessons.forEach(l => completedLessonsSet.add(l.id));

    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const updatedLessons = Array.from(completedLessonsSet);

      const res = await getUserProgress(userId);
      const progress = res.data || { current_level: 1, lessons_completed: [] };

      const newLevel =
        lesson.level === progress.current_level ? progress.current_level + 1 : progress.current_level;

      await updateUserProgress({
        user_id: userId,
        current_level: newLevel,
        lessons_completed: updatedLessons,
      });

      localStorage.removeItem('userProgress');
      navigate(`/lesson-complete`, { state: { level: lesson.level } });
    } catch (err) {
      console.error('Error finishing level:', err);
      alert('Failed to finish level. Try again.');
    }
  };

  const levelLessons = courseData.find(l => l.level === lesson.level)?.skills || [];
  const currentIndex = levelLessons.findIndex(l => l.id === lesson.id);
  const prevLessonId = currentIndex > 0 ? levelLessons[currentIndex - 1].id : null;
  const nextLessonId = currentIndex < levelLessons.length - 1 ? levelLessons[currentIndex + 1].id : null;

  const goToLesson = (lessonId) => {
    setLevelProgress(prev => ({ ...prev, [lesson.id]: { answers, feedback } }));
    setLesson(null);
    setParsedContent(null);
    setAnswers({});
    setFeedback({});
    setAllCorrect(false);
    setLoading(true);
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="lesson-page">
      <div className="back-to-lessons-container">
        <button 
          className="back-to-lessons-btn" 
          onClick={() => navigate('/lesson')}
        >
          <FaArrowLeft /> Back to Lessons
        </button>
      </div>

      <div className="lesson-container">
        <div className="lesson-header">
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="lesson-description">{parsedContent.lesson_overview}</p>
        </div>

        <div className="lesson-content">
          {parsedContent.instructions?.length > 0 && (
            <div className="lesson-section instructions-container">
              <h2><FaClipboardList /> Instructions</h2>
              <ul>{parsedContent.instructions.map((inst, idx) => <li key={idx}>{inst}</li>)}</ul>
            </div>
          )}

          {parsedContent.audio_url && (
            <div className="lesson-section audio-container">
              <h2><FaHeadphones /> Listening Practice</h2>
              <audio controls>
                <source src={parsedContent.audio_url} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {parsedContent.transcript && (
            <div className="lesson-section transcript-container">
              <h2><FaBookOpen /> Transcript</h2>
              <pre>{parsedContent.transcript}</pre>
            </div>
          )}

          {parsedContent.vocabulary?.length > 0 && (
            <div className="lesson-section vocabulary-container">
              <h2><FaBookOpen /> Vocabulary</h2>
              <ul>
                {parsedContent.vocabulary.map((word, idx) => (
                  <li key={idx}><strong>{word}</strong></li>
                ))}
              </ul>
            </div>
          )}

          {parsedContent.grammar?.length > 0 && (
            <div className="lesson-section grammar-container">
              <h2><FaBookOpen /> Grammar</h2>
              <ul>
                {parsedContent.grammar.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedContent.exercises?.length > 0 && (
            <div className="lesson-section exercises-container">
              <h2><FaClipboardList /> Exercises</h2>
              {parsedContent.exercises.map((ex, idx) => (
                <div key={idx} className="exercise" ref={el => exerciseRefs.current[idx] = el}>
                  <p>{ex.question}</p>

                  {ex.type === 'multiple_choice' && (
                    <div> 
                      {ex.options?.map((opt, oIdx) => {
                        const isSelected = answers[idx] === opt; 
                        const isCorrect = feedback[idx] === 'correct' && isSelected;
                        const isIncorrect = feedback[idx] === 'incorrect' && isSelected;

                        return (
                          <button 
                            key={oIdx}
                            onClick={() => handleMCQAnswer(idx, opt)}
                            className={`option-btn 
                              ${isSelected ? 'selected' : ''} 
                              ${isCorrect ? 'correct' : ''} 
                              ${isIncorrect ? 'incorrect' : ''}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* FIXED: Handle both fill_in_blank types */}
                  {(ex.type === 'fill_in_the_blank' || ex.type === 'fill_in_blank') && (
                    <div className="fill-blank-container">
                      <input
                        type="text"
                        value={answers[idx] || ''}
                        placeholder="Type your answer..."
                        onChange={(e) => handleFillAnswer(idx, e.target.value)}
                      />
                    </div>
                  )}

                  {ex.type === 'matching' && (
                    <div className="matching-container">
                      {(() => {
                        // Handle both array and object formats for pairs
                        const pairs = Array.isArray(ex.pairs) ? ex.pairs : Object.entries(ex.pairs || {});
                        const meanings = Array.from(new Set(pairs.map(pair => pair[1])));
                        
                        return pairs.map((pair, pIdx) => {
                          const key = `${idx}-${pIdx}`;
                          const selected = answers[key] || '';

                          return (
                            <div key={pIdx} className="matching-pair">
                              <span className="match-word">{pair[0]}</span>
                              <select
                                value={selected}
                                onChange={(e) => {
                                  const newAnswers = { ...answers, [key]: e.target.value };
                                  setAnswers(newAnswers);

                                  const allPairsCorrect = pairs.every((p, i) => newAnswers[`${idx}-${i}`] === p[1]);
                                  setFeedback(prev => ({ ...prev, [idx]: allPairsCorrect ? 'correct' : 'incorrect' }));
                                }}
                              >
                                <option value="">Select meaning</option>
                                {meanings.map((meaning, oIdx) => (
                                  <option key={oIdx} value={meaning}>
                                    {meaning}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {feedback[idx] && (
                    <span className={`feedback ${feedback[idx]}`}>
                      {feedback[idx] === 'correct' ? <FaCheck /> : <FaTimes />}
                    </span>
                  )}
                </div>
              ))}

              <div className="submit-answers-container" ref={submitBtnRef}>
                <button className="submit-answers-btn" onClick={handleSubmitAnswers}>
                  Submit Answers
                </button>
              </div>
            </div>
          )}

          {parsedContent.tips?.length > 0 && (
            <div className="lesson-section tips-container">
              <h2><FaLightbulb /> Tips</h2>
              <ul>{parsedContent.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}</ul>
            </div>
          )}
        </div>

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

          {lastLessonInLevel ? (
            <button className="nav-button finish" onClick={handleFinishLevel}>
              Finish Level
            </button>
          ) : (
            <button
              className={`nav-button next ${!allCorrect ? 'disabled' : ''}`}
              onClick={() => allCorrect && goToLesson(nextLessonId)}
              disabled={!allCorrect}
            >
              Next Lesson <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}