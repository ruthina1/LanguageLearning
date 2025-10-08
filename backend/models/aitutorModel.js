import pool from '../config/db.js';

class AITutorModel {

  static async getConversationById(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  }

  static async createConversation(userId, title) {
    const [result] = await pool.execute(
      'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
      [userId, title || 'New Conversation']
    );
    return { id: result.insertId, title: title || 'New Conversation' };
  }

  static async addMessage(conversationId, text, sender) {
    const [result] = await pool.execute(
      'INSERT INTO messages (conversation_id, text, sender) VALUES (?, ?, ?)',
      [conversationId, text, sender]
    );
    return result.insertId;
  }

  static async getMessages(conversationId) {
    const [messages] = await pool.execute(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );
    return messages;
  }

  static async getUserConversations(userId) {
    const [conversations] = await pool.execute(
      `SELECT c.*, 
              (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM conversations c 
       WHERE user_id = ? 
       ORDER BY updated_at DESC`,
      [userId]
    );
    return conversations;
  }

static async createConversation(userId, title) {

  try {
    const [result] = await pool.execute(
      'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
      [userId, title || 'New Conversation']
    );

    return { id: result.insertId, title: title || 'New Conversation' };
  } catch (error) {

    throw error;
  }
}

static async addMessage(conversationId, text, sender) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO messages (conversation_id, text, sender) VALUES (?, ?, ?)',
      [conversationId, text, sender]
    );

    return result.insertId;
  } catch (error) {
    throw error;
  }
}

static async getConversationById(id, userId) {

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

  static async saveGrammarAnalysis(userId, analysis) {
    const [result] = await pool.execute(
      `INSERT INTO grammar_analyses 
        (user_id, original_text, corrected_text, is_perfect, overall_feedback_english, overall_feedback_amharic) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        analysis.originalText,
        analysis.correctedText,
        analysis.isPerfect,
        analysis.overallFeedback?.english || '',
        analysis.overallFeedback?.amharic || ''
      ]
    );
    return result.insertId;
  }

  static async saveGrammarErrors(grammarAnalysisId, errors) {
    for (const error of errors) {
      const [errorResult] = await pool.execute(
        `INSERT INTO grammar_errors 
          (grammar_analysis_id, original_text, correction, severity, explanation_english, explanation_amharic)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          grammarAnalysisId,
          error.original,
          error.correction,
          error.severity,
          error.explanationEnglish,
          error.explanationAmharic
        ]
      );

      if (error.examples && error.examples.length > 0) {
        for (const example of error.examples) {
          await pool.execute(
            'INSERT INTO grammar_error_examples (grammar_error_id, example_text) VALUES (?, ?)',
            [errorResult.insertId, example]
          );
        }
      }
    }
  }

  static async saveImprovementTips(grammarAnalysisId, tips) {
    for (const tip of tips) {
      await pool.execute(
        'INSERT INTO improvement_tips (grammar_analysis_id, tip_text, category) VALUES (?, ?, ?)',
        [grammarAnalysisId, tip.tip, tip.category || 'general']
      );
    }
  }

  static async getGrammarHistory(userId) {
    const [history] = await pool.execute(
      'SELECT id, original_text, corrected_text, created_at FROM grammar_analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    return history;
  }

  static async savePronunciationEvaluation(userId, targetText, spokenText, evaluation, audioUrl) {
    const [result] = await pool.execute(
      `INSERT INTO pronunciation_evaluations
        (user_id, target_text, spoken_text, accuracy_score, audio_url)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, targetText, spokenText, evaluation.accuracyScore, audioUrl]
    );
    const evaluationId = result.insertId;

    await pool.execute(
      `INSERT INTO pronunciation_feedback 
       (pronunciation_evaluation_id, strengths, areas_to_improve, practice_exercises)
       VALUES (?, ?, ?, ?)`,
      [
        evaluationId,
        JSON.stringify(evaluation.feedback?.strengths || []),
        JSON.stringify(evaluation.feedback?.areasToImprove || []),
        JSON.stringify(evaluation.feedback?.practiceExercises || [])
      ]
    );

    if (evaluation.mispronouncedWords && evaluation.mispronouncedWords.length > 0) {
      for (const word of evaluation.mispronouncedWords) {
        await pool.execute(
          `INSERT INTO mispronounced_words
           (pronunciation_evaluation_id, word, issue_description, correction_tip, phonetic_spelling)
           VALUES (?, ?, ?, ?, ?)`,
          [evaluationId, word.word, word.issue, word.tip, word.phoneticSpelling]
        );
      }
    }

    return evaluationId;
  }

  static async getPronunciationHistory(userId) {
    const [history] = await pool.execute(
      'SELECT id, target_text, accuracy_score, created_at FROM pronunciation_evaluations WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    return history;
  }

  static async getUserProgress(userId) {
    const [progress] = await pool.execute(
      'SELECT * FROM user_ai_progress WHERE user_id = ?',
      [userId]
    );
    return progress[0] || null;
  }

  static async createInitialProgress(userId) {
    const [result] = await pool.execute(
      `INSERT INTO user_ai_progress 
        (user_id, level, xp, streak, grammar_sessions, pronunciation_sessions, chat_sessions, total_ai_sessions)
       VALUES (?, 1, 0, 0, 0, 0, 0, 0)`,
      [userId]
    );
    return result.insertId;
  }

  static async updateProgress(userId, updates) {
    const setQuery = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(userId);

    await pool.execute(
      `UPDATE user_ai_progress SET ${setQuery} WHERE user_id = ?`,
      values
    );
  }
}

export default AITutorModel;