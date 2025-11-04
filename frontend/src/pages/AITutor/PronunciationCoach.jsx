import React, { useState, useRef } from 'react';
import { useAITutor } from '../../contexts/AITutorContext';
import { 
  FaMicrophone, 
  FaStop, 
  FaChartBar, 
  FaCheck, 
  FaChartLine, 
  FaVolumeUp, 
  FaDumbbell,
  FaPlay,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';
import './PronunciationCoach.css';

export default function PronunciationCoach() {
  const { evaluatePronunciation, pronunciationEvaluation, isProcessing } = useAITutor();
  const [targetText, setTargetText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [transcribedText, setTranscribedText] = useState(''); // What was actually said
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const practicePhrases = [
    "The weather is very nice today",
    "I would like to practice English",
    "How are you doing today?",
    "Could you please help me?",
    "What time is the meeting?"
  ];

  // Simple speech-to-text using Web Speech API
// In your PronunciationCoach.js - update the transcribeAudio method
const transcribeAudio = async (audioBlob) => {
  return new Promise((resolve, reject) => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let transcriptionResult = '';
    let hasResult = false;

    recognition.onresult = (event) => {
      hasResult = true;
      const transcript = event.results[0][0].transcript;
      transcriptionResult = transcript;
      console.log('🎤 Speech recognition result:', transcript);
    };

    recognition.onerror = (event) => {
      console.error('🎤 Speech recognition error:', event.error);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      console.log('🎤 Speech recognition ended, hasResult:', hasResult);
      if (hasResult && transcriptionResult) {
        resolve(transcriptionResult);
      } else {
        reject(new Error('No speech detected or recognized'));
      }
    };

    // Create a temporary URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Set a timeout to handle cases where recognition doesn't start
    const timeout = setTimeout(() => {
      console.log('🎤 Speech recognition timeout');
      recognition.stop();
      reject(new Error('Speech recognition timeout'));
    }, 10000);

    audio.oncanplaythrough = () => {
      console.log('🎤 Starting speech recognition...');
      clearTimeout(timeout);
      recognition.start();
      
      // Play the audio for recognition
      audio.play().catch((playError) => {
        console.warn('🎤 Audio play failed, continuing with recognition:', playError);
      });
    };

    audio.onerror = (error) => {
      console.error('🎤 Audio playback error:', error);
      clearTimeout(timeout);
      recognition.start(); // Try recognition anyway
    };

    audio.onended = () => {
      console.log('🎤 Audio playback ended');
    };
  });
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      } 
    });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordedAudio(audioUrl);
      
      // Try to transcribe the audio
      try {
        setTranscriptionError('');
        console.log('🎤 Attempting transcription...');
        const transcribed = await transcribeAudio(audioBlob);
        setTranscribedText(transcribed);
        console.log('🎤 Transcribed text:', transcribed);
        
        // Auto-analyze if transcription successful
        await handleEvaluation(transcribed);
      } catch (error) {
        console.warn('⚠️ Speech recognition failed:', error.message);
        setTranscriptionError('Could not automatically transcribe. Please type what you said below.');
        setTranscribedText('');
        setShowAnalysis(true);
      }
    };

    mediaRecorder.start(100); // Collect data every 100ms
    setIsRecording(true);
    setShowAnalysis(false);
    setTranscribedText('');
    setTranscriptionError('');
    
    // Auto-stop after 10 seconds to prevent infinite recording
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 10000);
    
  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('Please allow microphone access to use pronunciation practice.');
  }
};

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleEvaluation = async () => {
    if (!targetText.trim()) {
      alert('Please enter a target phrase to practice');
      return;
    }

    if (!transcribedText.trim()) {
      alert('Please wait for transcription or type what you said');
      return;
    }

    try {
      await evaluatePronunciation(transcribedText, targetText, recordedAudio);
    } catch (error) {
      alert('Failed to evaluate pronunciation. Please try again.');
    }
  };

  const handlePracticePhraseClick = (phrase) => {
    setTargetText(phrase);
    setRecordedAudio(null);
    setTranscribedText('');
    setShowAnalysis(false);
    setTranscriptionError('');
  };

  const startNewPractice = () => {
    setTargetText('');
    setRecordedAudio(null);
    setTranscribedText('');
    setShowAnalysis(false);
    setTranscriptionError('');
  };

  // Calculate text similarity for manual verification
  const calculateSimilarity = (text1, text2) => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = (commonWords.length / Math.max(words1.length, words2.length)) * 100;
    
    return Math.round(similarity);
  };

  const similarityScore = transcribedText && targetText ? calculateSimilarity(transcribedText, targetText) : 0;

  return (
    <div className="pronunciation-coach">
      <div className="coach-header">
        <h2><FaMicrophone /> Pronunciation Coach</h2>
        <p>Practice your English pronunciation and get instant feedback</p>
      </div>

      <div className="practice-section">
        <div className="target-phrase">
          <label>Practice this phrase:</label>
          <input
            type="text"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            placeholder="Type a phrase to practice pronunciation..."
            className="phrase-input"
          />
        </div>

        <div className="recording-section">
          {!isRecording ? (
            <button 
              onClick={startRecording} 
              disabled={!targetText.trim()}
              className="record-btn"
            >
              <FaMicrophone /> Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="stop-btn">
              <FaStop /> Stop Recording
            </button>
          )}

          {isRecording && (
            <div className="recording-indicator">
              <div className="pulsing-dot"></div>
              <span>Recording... Speak now!</span>
            </div>
          )}

          {recordedAudio && (
            <div className="playback-section">
              <h4>Your Recording:</h4>
              <audio controls src={recordedAudio} className="playback-audio" />
              <button 
                onClick={startNewPractice} 
                className="new-practice-btn"
              >
                <FaSync /> New Practice
              </button>
            </div>
          )}
        </div>

        {/* Analysis Section - Shows after recording */}
        {showAnalysis && recordedAudio && (
          <div className="analysis-section">
            <h3><FaChartBar /> Analyze Your Pronunciation</h3>
            
            <div className="transcription-section">
              <div className="transcription-result">
                <label>What you said (auto-transcribed):</label>
                <input
                  type="text"
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  placeholder="Transcription will appear here..."
                  className="transcription-input"
                  readOnly={!transcriptionError} // Only editable if auto-transcription failed
                />
                {transcriptionError && (
                  <div className="transcription-warning">
                    <FaExclamationTriangle /> {transcriptionError}
                  </div>
                )}
              </div>

              {transcribedText && targetText && (
                <div className="similarity-check">
                  <div className="similarity-score">
                    Text Match: {similarityScore}%
                    {similarityScore < 70 && (
                      <span className="similarity-warning">
                        <FaExclamationTriangle /> Low match with target phrase
                      </span>
                    )}
                  </div>
                  <div className="text-comparison">
                    <div><strong>Target:</strong> "{targetText}"</div>
                    <div><strong>You said:</strong> "{transcribedText}"</div>
                  </div>
                </div>
              )}
            </div>

            <div className="analysis-actions">
              <button 
                onClick={handleEvaluation}
                disabled={isProcessing || !transcribedText.trim()}
                className="analyze-btn"
              >
                {isProcessing ? (
                  <>
                    <FaSync className="spinning" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FaPlay /> Analyze Pronunciation
                  </>
                )}
              </button>
              
              {similarityScore < 70 && (
                <div className="accuracy-warning">
                  <FaExclamationTriangle /> 
                  The transcribed text doesn't match the target well. 
                  Make sure you said the correct phrase for accurate evaluation.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="practice-phrases">
        <h4>Practice Phrases:</h4>
        <div className="phrase-chips">
          {practicePhrases.map((phrase, index) => (
            <button
              key={index}
              className="phrase-chip"
              onClick={() => handlePracticePhraseClick(phrase)}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Pronunciation Results */}
      {pronunciationEvaluation && (
        <div className="pronunciation-results">
          <div className="results-header">
            <h3>Pronunciation Evaluation</h3>

           <div className="accuracy-score">
            
              <div className="score-circle">
                <span className="score-value">
                  {similarityScore}%
                </span>
                <span className="score-label">Accuracy</span>
              </div>
            </div>

          </div>

          <div className="text-comparison-result">
            <div><strong>Target:</strong> "{targetText}"</div>
            <div><strong>You said:</strong> "{transcribedText}"</div>
            <div className="similarity-final">Text Match: {similarityScore}%</div>
          </div>

          <div className="evaluation-details">
            <div className="strengths-section">
              <h4><FaCheck /> Strengths:</h4>
              <ul>
                {(pronunciationEvaluation.feedback?.strengths || []).map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="improvement-section">
              <h4><FaChartLine /> Areas to Improve:</h4>
              <ul>
                {(pronunciationEvaluation.feedback?.areasToImprove || []).map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>

            <div className="practice-exercises">
              <h4><FaDumbbell /> Practice Exercises:</h4>
              <ul>
                {(pronunciationEvaluation.feedback?.practiceExercises || []).map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </div>

            {(pronunciationEvaluation.mispronounced_words && pronunciationEvaluation.mispronounced_words.length > 0) && (
              <div className="mispronounced-words">
                <h4><FaVolumeUp /> Mispronounced Words:</h4>
                {pronunciationEvaluation.mispronounced_words.map((word, index) => (
                  <div key={index} className="word-item">
                    <strong>{word.word}</strong>: {word.issue_description}
                    <div className="correction-tip">
                      <em>Tip:</em> {word.correction_tip}
                    </div>
                    {word.phonetic_spelling && (
                      <div className="phonetic-spelling">
                        <em>Sound:</em> {word.phonetic_spelling}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}