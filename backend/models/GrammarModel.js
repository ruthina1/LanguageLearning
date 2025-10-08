import pool from '../config/db.js';

class GrammarModel {
  async createGrammarAnalysis(userId, originalText, correctedText, isPerfect, overallFeedbackEnglish, overallFeedbackAmharic) {
    const [result] = await pool.execute(
      'INSERT INTO grammar_analyses (user_id, original_text, corrected_text, is_perfect, overall_feedback_english, overall_feedback_amharic) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, originalText, correctedText, isPerfect, overallFeedbackEnglish, overallFeedbackAmharic]
    );
    return result.insertId;
  }

  async createGrammarError(grammarAnalysisId, originalText, correction, severity, explanationEnglish, explanationAmharic) {
    const [result] = await pool.execute(
      'INSERT INTO grammar_errors (grammar_analysis_id, original_text, correction, severity, explanation_english, explanation_amharic) VALUES (?, ?, ?, ?, ?, ?)',
      [grammarAnalysisId, originalText, correction, severity, explanationEnglish, explanationAmharic]
    );
    return result.insertId;
  }

  async createGrammarErrorExample(grammarErrorId, exampleText) {
    const [result] = await pool.execute(
      'INSERT INTO grammar_error_examples (grammar_error_id, example_text) VALUES (?, ?)',
      [grammarErrorId, exampleText]
    );
    return result.insertId;
  }

  async createImprovementTip(grammarAnalysisId, tipText, category = null) {
    const [result] = await pool.execute(
      'INSERT INTO improvement_tips (grammar_analysis_id, tip_text, category) VALUES (?, ?, ?)',
      [grammarAnalysisId, tipText, category]
    );
    return result.insertId;
  }

  async getUserGrammarAnalyses(userId, limit = 10) {
    const [analyses] = await pool.execute(
      `SELECT ga.*, 
              COUNT(ge.id) as error_count
       FROM grammar_analyses ga
       LEFT JOIN grammar_errors ge ON ga.id = ge.grammar_analysis_id
       WHERE ga.user_id = ?
       GROUP BY ga.id
       ORDER BY ga.created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return analyses;
  }

async getGrammarAnalysisWithDetails(analysisId, userId) {
  const [analyses] = await pool.execute(
    'SELECT * FROM grammar_analyses WHERE id = ? AND user_id = ?',
    [analysisId, userId]
  );
  
  if (analyses.length === 0) return null;

  const [errors] = await pool.execute(
    `SELECT ge.*, 
            (SELECT JSON_ARRAYAGG(example_text) 
             FROM grammar_error_examples 
             WHERE grammar_error_id = ge.id) as examples
     FROM grammar_errors ge 
     WHERE ge.grammar_analysis_id = ?`,
    [analysisId]
  );

  const [tips] = await pool.execute(
    'SELECT * FROM improvement_tips WHERE grammar_analysis_id = ?',
    [analysisId]
  );

  return {
    ...analyses[0],
    errors: errors.map(error => ({
      ...error,
      examples: error.examples ? JSON.parse(error.examples) : []
    })),
    improvementTips: tips
  };
}
}

export default new GrammarModel();
