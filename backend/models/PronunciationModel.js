import pool from '../config/db.js';

class PronunciationModel {
  static async createPronunciationEvaluation(userId, targetText, spokenText, accuracyScore, audioUrl = null) {
    try {
      if (!userId || !targetText || !spokenText || accuracyScore === undefined) {
        throw new Error('Missing required parameters for pronunciation evaluation');
      }

      const [result] = await pool.execute(
        `INSERT INTO pronunciation_evaluations 
         (user_id, target_text, spoken_text, accuracy_score, audio_url, created_at) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          userId,
          targetText,
          spokenText,
          accuracyScore,
          audioUrl
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async createPronunciationFeedback(evaluationId, strengths, areasToImprove, practiceExercises) {
    try {

      const strengthsJson = strengths ? JSON.stringify(strengths) : JSON.stringify([]);
      const areasToImproveJson = areasToImprove ? JSON.stringify(areasToImprove) : JSON.stringify([]);
      const practiceExercisesJson = practiceExercises ? JSON.stringify(practiceExercises) : JSON.stringify([]);

      const [result] = await pool.execute(
        `INSERT INTO pronunciation_feedback 
         (pronunciation_evaluation_id, strengths, areas_to_improve, practice_exercises) 
         VALUES (?, ?, ?, ?)`,
        [evaluationId, strengthsJson, areasToImproveJson, practiceExercisesJson]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async createMispronouncedWord(evaluationId, word, issue, tip, phoneticSpelling = null) {
    try {

      const [result] = await pool.execute(
        `INSERT INTO mispronounced_words 
         (pronunciation_evaluation_id, word, issue_description, correction_tip, phonetic_spelling) 
         VALUES (?, ?, ?, ?, ?)`,
        [evaluationId, word, issue, tip, phoneticSpelling]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

static async getPronunciationEvaluationWithDetails(evaluationId, userId) {
  try {

    const [evaluations] = await pool.execute(
      `SELECT * FROM pronunciation_evaluations 
       WHERE id = ? AND user_id = ?`,
      [evaluationId, userId]
    );

    if (evaluations.length === 0) {
      return null;
    }

    const evaluation = evaluations[0];

    const [feedbackRows] = await pool.execute(
      `SELECT * FROM pronunciation_feedback 
       WHERE pronunciation_evaluation_id = ?`,
      [evaluationId]
    );

    let feedback = {
      strengths: [],
      areasToImprove: [],
      practiceExercises: []
    };
    
    if (feedbackRows.length > 0) {
      const feedbackData = feedbackRows[0];

      feedback.strengths = this.safeJsonParse(feedbackData.strengths, ["Good pronunciation effort"]);
      feedback.areasToImprove = this.safeJsonParse(feedbackData.areas_to_improve, ["Continue practicing"]);
      feedback.practiceExercises = this.safeJsonParse(feedbackData.practice_exercises, ["Repeat the phrase slowly"]);
    }

    const [wordsRows] = await pool.execute(
      `SELECT * FROM mispronounced_words 
       WHERE pronunciation_evaluation_id = ?`,
      [evaluationId]
    );

    const mispronouncedWords = wordsRows.map(row => ({
      word: row.word,
      issue_description: row.issue_description,
      correction_tip: row.correction_tip,
      phonetic_spelling: row.phonetic_spelling
    }));

    const result = {
      id: evaluation.id,
      target_text: evaluation.target_text,
      spoken_text: evaluation.spoken_text,
      accuracy_score: evaluation.accuracy_score,
      audio_url: evaluation.audio_url,
      created_at: evaluation.created_at,
      feedback: feedback,
      mispronounced_words: mispronouncedWords
    };

    return result;
  } catch (error) {
    throw error;
  }
}

static safeJsonParse(jsonString, fallback = []) {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch (firstError) {
    try {
      let cleaned = jsonString.trim();
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }

      if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
        return JSON.parse(cleaned);
      }

      if (cleaned.includes(',') || cleaned.includes('"')) {
        return JSON.parse(`[${cleaned}]`);
      }
      
      return [cleaned];
    } catch (secondError) {
      console.warn(' JSON parsing failed, using fallback');
      return fallback;
    }
  }
}

  static async getUserPronunciationEvaluations(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM pronunciation_evaluations 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(' Error fetching user pronunciation evaluations:', error);
      throw error;
    }
  }
}

export default PronunciationModel;