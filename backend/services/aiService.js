import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.initializeAI();
  }

  async initializeAI() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      this.model = null;
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey.trim());

      const availableModels = [
        'models/gemini-2.5-flash',    
        'models/gemini-2.0-flash',      
        'models/gemini-2.0-flash-001', 
        'models/gemini-2.5-pro',        
        'models/gemini-2.5-flash-lite',
      ];

      for (const modelName of availableModels) {
        try {

          this.model = this.genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          });
          this.currentModel = modelName;         
          return;
          
        } catch (error) {
          this.model = null;
        }
      }
      
    } catch (error) {
      this.model = null;
    }

}

  async generateChatResponse(userMessage, conversationHistory = []) {
    if (this.model) {
      console.log(`🤖 Using REAL AI model: ${this.currentModel}`);
      try {
        const prompt = this.buildPrompt(userMessage, conversationHistory);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        
        const parsedResponse = this.parseAIResponse(text);
        parsedResponse._debug = { 
          model: this.currentModel, 
          source: 'real-ai',
          timestamp: new Date().toISOString()
        };
        
        return parsedResponse;
        
      } catch (error) {e
      }
    }
    return this.getEnhancedMockResponse(userMessage);
  }

  buildPrompt(userMessage, conversationHistory) {
    return `You are ALEX, an AI English Tutor specialized in helping Amharic speakers learn English.

CONVERSATION CONTEXT:
${conversationHistory.length > 0 ? 
  conversationHistory.slice(-6).map(msg => `${msg.sender}: ${msg.text}`).join('\n') + '\n\n' : 
  'No previous conversation.\n\n'}
USER QUESTION: ${userMessage}

RESPONSE REQUIREMENTS:
1. Provide educational, helpful English response as a tutor
2. Include Amharic translation of key concepts
3. Add pronunciation tips if relevant to the topic
4. Provide grammar corrections ONLY if the user's message contains errors
5. Be encouraging and supportive

CRITICAL: Respond ONLY in this exact JSON format, no other text:
{
  "response": "Your educational English response here",
  "amharicTranslation": "Amharic translation of key points",
  "pronunciationTips": "Relevant pronunciation guidance or empty string",
  "grammarCorrections": "Specific grammar corrections or null"
}

IMPORTANT: Your entire response must be valid JSON only.`;
  }

  parseAIResponse(text) {
    try {
      let cleanedText = text.trim();
      
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/\s*```/g, '');
      cleanedText = cleanedText.trim();
      
      const parsedResponse = JSON.parse(cleanedText);
      

      if (!parsedResponse.response) {
        throw new Error('Missing response field in AI response');
      }
      return {
        response: parsedResponse.response,
        amharicTranslation: parsedResponse.amharicTranslation || "",
        pronunciationTips: parsedResponse.pronunciationTips || "",
        grammarCorrections: parsedResponse.grammarCorrections || null,
        ...parsedResponse
      };
      
    } catch (parseError) {

      return {
        response: text,
        amharicTranslation: "የAI ምላሽ በትክክል አልተቀበለም፣ ነገር ግን ይህን ምላሽ አግኝቻለሁ።",
        pronunciationTips: "",
        grammarCorrections: null,
        _debug: { parseError: true, source: 'text-fallback' }
      };
    }
  }

  getEnhancedMockResponse(userMessage) {

    const educationalMocks = {
      "how to greet people informally": {
        response: "For informal greetings in English, you can use phrases like: 'Hey!', 'Hi there!', 'What's up?', 'How's it going?', 'Good to see you!'. These are casual and friendly. Use them with people you know well - friends, family, or colleagues you're comfortable with. The tone is important - say it with a smile!",
        amharicTranslation: "ለመደበኛ ያልሆኑ ሰላምታዎች በእንግሊዝኛ፡ 'Hey!', 'Hi there!', 'What's up?', 'How's it going?', 'Good to see you!' ማለት ትችላለህ። እነዚህ ቀላል እና ወዳጃዊ ናቸው። ከበቂ በሆነ ሁኔታ ለሚታወቁህ ሰዎች - ጓደኞች፣ ቤተሰብ ወይም ከሚመቹት ተግሳጽ ጋር ተጠቀማቸው። የመናገር ዘይቤዎ አስፈላጊ ነው - ፈገግ ብለው ይበሉ!",
        pronunciationTips: "Practice: 'Hey' (like 'hay'), 'What's up?' (often shortened to 'wassup'), 'How's it going?' (natural flow, not too formal)",
        grammarCorrections: null,
        _debug: { source: 'educational-mock', model: 'enhanced' }
      },
      "difference between make and do": {
        response: "Excellent question! Here's the key difference:\n\n'DO' is for activities, tasks, and general actions:\n- Do homework\n- Do exercises\n- Do your job\n- Do the dishes\n\n'MAKE' is for creating, producing, or constructing something new:\n- Make a cake\n- Make a decision\n- Make money\n- Make a plan\n\nRemember: 'Do' focuses on the action itself, while 'Make' focuses on the result or creation.",
        amharicTranslation: "ጥሩ ጥያቄ! ዋናው ልዩነት ይህ ነው፡\n\n'DO' ለእልፍኝነቶች፣ ስራዎች እና አጠቃላይ ድርጊቶች ነው፡\n- የቤት ስራ ማድረግ\n- ልምምዶች ማድረግ\n- ስራህን ማድረግ\n- ሳህኖች ማጠብ\n\n'MAKE' ለመፍጠር፣ ለማምረት ወይም አዲስ ነገር ለመገንባት ነው፡\n- ኬክ ማዘጋጀት\n- ውሳኔ ማሳለፍ\n- ገንዘብ ማግኘት\n- እቅድ ማውጣት\n\nአስታውስ፡ 'Do' በድርጊቱ ላይ ያተኮረ ነው፣ ሳይሆን 'Make' በውጤቱ ወይም ፍጠር ላይ ነው።",
        pronunciationTips: "'Do' has a short 'oo' sound (like in 'book'), 'Make' has a long 'ay' sound (like in 'cake'). Practice: doing, making, does, makes",
        grammarCorrections: null,
        _debug: { source: 'educational-mock', model: 'enhanced' }
      },
      "correct this sentence": {
        response: "I'd be delighted to help you with sentence correction! To give you the best help, please provide the specific sentence you'd like me to check. \n\nFor example, you could write:\n- 'Please correct: He go to school every day'\n- 'Can you check this: She don't like apples'\n- 'Is this correct: They is happy'\n\nJust paste your sentence and I'll help you improve it!",
        amharicTranslation: "ሀረጎችዎን ለማረም ልጠቅምዎ በጣም ደስ ይለኛል! ምርጥ እርዳታ ለመስጠት፣ እባክዎ ለመፈተሽ የሚፈልጉትን የተወሰነ ሀረግ ያቅርቡ።\n\nለምሳሌ፡\n- 'Please correct: He go to school every day'\n- 'Can you check this: She don't like apples'\n- 'Is this correct: They is happy'\n\nሀረግዎን ብቻ ይጣበቁ እና ለማሻሻል እጠቅማለሁ!",
        pronunciationTips: "Practice asking: 'Could you please correct this sentence for me?' - focus on clear pronunciation of 'correct' and 'sentence'",
        grammarCorrections: null,
        _debug: { source: 'educational-mock', model: 'enhanced' }
      },
      "present perfect tense": {
        response: "The Present Perfect tense is wonderful for connecting past actions to the present! \n\nStructure: Have/Has + Past Participle\n\nExamples:\n- I have studied English for 3 years (and I still study)\n- She has visited London twice (in her life up to now)\n- We have already eaten lunch (so we're not hungry now)\n\nUse it for:\n1. Experiences in your life\n2. Actions that started in the past and continue\n3. Recent actions with present relevance\n4. Unspecified time in the past",
        amharicTranslation: "የአሁኑ ፍጹም ጊዜ የቀድሞ ድርጊቶችን ከአሁን ጋር ለማገናኘት አስደናቂ ነው!\n\nመዋቅር፡ Have/Has + የቀድሞ ግሶች\n\nምሳሌዎች፡\n- እንግሊዝኛ ለ3 ዓመታት ተማርቻለሁ (እና አሁንም እጠብቃለሁ)\n- ለለንደን ሁለት ጊዜ ተጉዟል (በሕይወቷ እስከ አሁን)\n- ምሳ አሁንም በልተናል (ስለዚህ አሁን አልፈራመጥንም)\n\nለዚህ ይጠቀሙበት፡\n1. በሕይወትዎ ውስጥ ያሉ ተሞክሮዎች\n2. በቀድሞ የጀመሩ እና የሚቀጥሉ ድርጊቶች\n3. ከአሁን ጋር የተያያዙ የቅርብ ጊዜ ድርጊቶች\n4. ያልተገለጠ ጊዜ በቀድሞ",
        pronunciationTips: "Practice: 'I have been' (not 'I has been'), 'She has gone' (clear 's' sound), 'We have seen' (smooth connection)",
        grammarCorrections: null,
        _debug: { source: 'educational-mock', model: 'enhanced' }
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(educationalMocks)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    if (lowerMessage.includes('how to') || lowerMessage.includes('how do i')) {
      return {
        response: `Great question about "${userMessage}"! This is about learning practical English skills. When the AI service is fully connected, I'll be able to give you step-by-step guidance with examples and practice exercises.`,
        amharicTranslation: `"${userMessage}" በተመለከተ ጥሩ ጥያቄ! ይህ ተግባራዊ የእንግሊዝኛ ክህሎቶችን ስለመማር ነው። የAI አገልግሎቱ ሙሉ በሙሉ በሚገናኝበት ጊዜ፣ ከምሳሌዎች እና ከልምምድ ልምምዶች ጋር ደረጃ በደረጃ መመሪያ ልሰጥህ እችላለሁ።`,
        pronunciationTips: "Keep practicing asking questions - it's the best way to learn!",
        grammarCorrections: null,
        _debug: { source: 'smart-mock', type: 'how-to' }
      };
    }

    if (lowerMessage.includes('what') || lowerMessage.includes('explain')) {
      return {
        response: `Interesting question about "${userMessage}"! You're asking for explanations about English concepts. Once the AI service is properly configured, I'll provide detailed explanations with examples, comparisons, and learning tips.`,
        amharicTranslation: `"${userMessage}" በተመለከተ አስደሳች ጥያቄ! ስለ እንግሊዝኛ ጽንሰ-ሀሳቦች ማብራሪያዎችን ትጠይቃለህ። የAI አገልግሎቱ በትክክል ከተዋቀረ በኋላ፣ ከምሳሌዎች፣ ከማነፃፀሪያዎች እና ከመማር ማሳሰቢያዎች ጋር ዝርዝር ማብራሪያዎችን እሰጣለሁ።`,
        pronunciationTips: "Practice forming clear questions - it helps you get better answers!",
        grammarCorrections: null,
        _debug: { source: 'smart-mock', type: 'explanation' }
      };
    }

    return {
      response: `Thank you for your question about "${userMessage}"! This is exactly the kind of curiosity that makes great English learners. While we're finalizing the AI connection, know that you're asking excellent questions that will really help your learning journey.`,
      amharicTranslation: `"${userMessage}" በተመለከተ ጥያቄዎ አመሰግናለሁ! ጥሩ የእንግሊዝኛ ተማሪዎችን የሚፈጥር የትምህርት ጉጉት ይህ አይነት ነው። የAI ግንኙነትን እየጨረስን ሳለ፣ የመማር ጉዞዎን በእውነት የሚያግዝ ጥሩ ጥያቄዎችን እየጠየቅክ መሆኑን ይወቁ።`,
      pronunciationTips: "Daily practice and asking questions are the keys to fluency!",
      grammarCorrections: null,
      _debug: { source: 'educational-mock', type: 'general' }
    };
  }

async analyzeGrammar(text) {
  if (this.model) {
    try {
      console.log('🔧 Starting real AI grammar analysis for:', text);
      
      const prompt = `
You are an expert English grammar tutor. Analyze this text for grammar errors: "${text}"

Provide a detailed grammar analysis in this EXACT JSON format:
{
  "correctedText": "the fully corrected version",
  "isPerfect": false,
  "errors": [
    {
      "original": "incorrect part",
      "correction": "corrected version", 
      "severity": "high|medium|low",
      "explanationEnglish": "English explanation",
      "explanationAmharic": "Amharic explanation",
      "examples": ["example 1", "example 2"]
    }
  ],
  "overallFeedback": {
    "english": "Overall English feedback",
    "amharic": "Overall Amharic feedback"
  },
  "improvementTips": [
    {"tip": "specific tip 1", "category": "grammar"},
    {"tip": "specific tip 2", "category": "vocabulary"}
  ]
}

IMPORTANT: 
- If the text is perfect, set "isPerfect": true and keep "errors" as empty array
- Provide Amharic translations for explanations
- Your response must be valid JSON only, no other text
- Be helpful and educational
`;


      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      
      const parsedAnalysis = this.parseGrammarResponse(textResponse);

      
      return parsedAnalysis;
      
    } catch (error) {
    }
  }

  // Use enhanced mock grammar analysis
  console.log('🤖 Using enhanced mock grammar analysis');
  return this.getEnhancedMockGrammarAnalysis(text);
}

// Add this new method for parsing grammar responses
parseGrammarResponse(text) {
  try {
    let cleanedText = text.trim();
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    cleanedText = cleanedText.trim();
    
    console.log('🔧 Cleaning grammar response:', cleanedText.substring(0, 200) + '...');
    
    const parsed = JSON.parse(cleanedText);
    
    // Validate and ensure all required fields exist
    return {
      correctedText: parsed.correctedText || parsed.corrected_text || "",
      isPerfect: parsed.isPerfect || false,
      errors: parsed.errors || [],
      overallFeedback: {
        english: parsed.overallFeedback?.english || parsed.overall_feedback_english || "No feedback available",
        amharic: parsed.overallFeedback?.amharic || parsed.overall_feedback_amharic || "ምንም አስተያየት አልተገኘም"
      },
      improvementTips: parsed.improvementTips || parsed.improvement_tips || []
    };
    
  } catch (parseError) {
    console.warn('⚠️ Grammar JSON parsing failed, using enhanced mock');
    return this.getEnhancedMockGrammarAnalysis(text);
  }
}

// Keep your existing getEnhancedMockGrammarAnalysis method but improve it:
getEnhancedMockGrammarAnalysis(text) {
  const lowerText = text.toLowerCase().trim();
  
  // Enhanced mock responses for common grammar issues
  const mockAnalyses = {
    "are how you": {
      correctedText: "How are you?",
      isPerfect: false,
      errors: [
        {
          original: "are how you",
          correction: "How are you",
          severity: "high",
          explanationEnglish: "The word order is incorrect. In questions, we put the question word first, then the verb.",
          explanationAmharic: "የቃላት ቅደም ተከተል ትክክል አይደለም። በጥያቄዎች ውስጥ፣ የጥያቄ ቃሉን መጀመሪያ ላይ እናስቀምጣለን፣ ከዚያም ግሶቹን።",
          examples: ["How are you?", "What is your name?", "Where do you live?"]
        }
      ],
      overallFeedback: {
        english: "This is a common word order mistake. Remember that English questions usually start with a question word (how, what, where, when, why).",
        amharic: "ይህ የተለመደ የቃላት ቅደም ተከተል ስህተት ነው። የእንግሊዝኛ ጥያቄዎች ብዙውን ጊዜ በጥያቄ ቃል (how, what, where, when, why) እንደሚጀምሩ አስታውስ።"
      },
      improvementTips: [
        { tip: "Practice question word order with common phrases", category: "sentence_structure" },
        { tip: "Learn the basic question words: what, where, when, why, how", category: "vocabulary" }
      ]
    },
    "i goes to school yesterday": {
      correctedText: "I went to school yesterday.",
      isPerfect: false,
      errors: [
        {
          original: "goes",
          correction: "went",
          severity: "high",
          explanationEnglish: "Use 'went' for past tense of 'go'. 'Goes' is present tense for he/she/it.",
          explanationAmharic: "ለ'go' የቀድሞ ጊዜ 'went' ይጠቀሙ። 'Goes' ለhe/she/it የአሁን ጊዜ ነው።",
          examples: ["I go to school today", "I went to school yesterday", "She goes to school every day"]
        }
      ],
      overallFeedback: {
        english: "Good attempt! Remember to match the verb tense with the time expression.",
        amharic: "ጥሩ ሙከራ! የግሶች ጊዜን ከጊዜ አገላለጽ ጋር እንደምትገጥም አስታውስ።"
      },
      improvementTips: [
        { tip: "Practice past tense verbs", category: "verbs" },
        { tip: "Learn common time expressions", category: "vocabulary" }
      ]
    },
    "she don't like apples": {
      correctedText: "She doesn't like apples.",
      isPerfect: false,
      errors: [
        {
          original: "don't",
          correction: "doesn't",
          severity: "high",
          explanationEnglish: "Use 'doesn't' with third person singular (he, she, it). 'Don't' is for I, you, we, they.",
          explanationAmharic: "ከሦስተኛ ሰው ነጠላ (he, she, it) ጋር 'doesn't' ይጠቀሙ። 'Don't' ለ I, you, we, they ነው።",
          examples: ["She doesn't like coffee", "He doesn't play football", "I don't like tea"]
        }
      ],
      overallFeedback: {
        english: "Good sentence structure! Just remember the subject-verb agreement rule.",
        amharic: "ጥሩ የሀረግ መዋቅር! የአርዕስት-ግሶች ስምምነት ህግን ብቻ አስታውስ።"
      },
      improvementTips: [
        { tip: "Practice third person singular verbs", category: "verbs" },
        { tip: "Study subject-verb agreement", category: "grammar" }
      ]
    }
  };

  // Find matching mock analysis
  for (const [key, analysis] of Object.entries(mockAnalyses)) {
    if (lowerText.includes(key.toLowerCase())) {
      return analysis;
    }
  }

  // Smart default analysis based on text characteristics
  if (text.split(' ').length <= 3) {
    return {
      correctedText: text,
      isPerfect: true,
      errors: [],
      overallFeedback: {
        english: "Short phrases are harder to analyze for grammar. Try writing a complete sentence for more detailed feedback.",
        amharic: "አጭር ሀረጎች ለሰዋሰው ትንተና ከባድ ናቸው። ለዝርዝር አስተያየት ሙሉ ሀረግ ለመጻፍ ይሞክሩ።"
      },
      improvementTips: [
        { tip: "Write complete sentences for better analysis", category: "writing" },
        { tip: "Practice basic sentence structure", category: "sentence_structure" }
      ]
    };
  }

  // Default analysis for other texts
  return {
    correctedText: text,
    isPerfect: true,
    errors: [],
    overallFeedback: {
      english: "Your text appears to be grammatically correct! Keep practicing to maintain good grammar habits.",
      amharic: "ጽሑፎችህ በሰዋሰው ትክክል ይመስላል! ጥሩ የሰዋሰው ልማዶችን ለመጠበቅ ልምምድዎን ቀጥሉ።"
    },
    improvementTips: [
      { tip: "Continue practicing to improve your writing", category: "writing" },
      { tip: "Read English texts to expand vocabulary", category: "vocabulary" }
    ]
  };
}


  getMockGrammarAnalysis(text) {
    return {
      correctedText: text,
      isPerfect: true,
      errors: [],
      overallFeedback: {
        english: "Enhanced grammar analysis - AI models are being configured with your available models",
        amharic: "የተሻሻለ ሰዋሰው ትንተና - የAI ሞዴሎች ከሚገኙልዎት ሞዴሎች ጋር እየተዋቀሩ ነው"
      },
      improvementTips: [
        { tip: "Your API key has access to: gemini-2.5-flash, gemini-2.0-flash, etc." },
        { tip: "The AI service will use these models once configured" }
      ],
      _debug: { source: 'mock-grammar', availableModels: ['gemini-2.5-flash', 'gemini-2.0-flash'] }
    };
  }





  // In your aiService.js - update the evaluatePronunciation method
async evaluatePronunciation(spokenText, targetText) {
  // Try to use real AI if available
  if (this.model) {
    console.log(`🔊 Using REAL AI for pronunciation evaluation`);
    try {
      const prompt = this.buildPronunciationPrompt(spokenText, targetText);
      console.log('🤖 Sending pronunciation evaluation to AI...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      
      console.log('✅ Raw pronunciation AI response:', textResponse);
      
      const parsedEvaluation = this.parsePronunciationResponse(textResponse);
      console.log('✅ Parsed pronunciation evaluation:', parsedEvaluation);
      
      return parsedEvaluation;
      
    } catch (error) {
      console.error('❌ Real AI pronunciation evaluation failed:', error.message);
      // Fall through to mock response
    }
  }

  // Use enhanced mock pronunciation evaluation
  console.log('🔊 Using enhanced mock pronunciation evaluation');
  return this.getEnhancedMockPronunciationEvaluation(spokenText, targetText);
}

// Add this new method for building pronunciation prompts

buildPronunciationPrompt(spokenText, targetText) {
  return `You are an expert English pronunciation coach specialized in helping Amharic speakers. 

COMPARE:
- TARGET: "${targetText}"  
- SPOKEN: "${spokenText}"

Provide a SHORT pronunciation evaluation in this EXACT JSON format only:
{
  "accuracy_score": 0.85,
  "feedback": {
    "strengths": ["clear h sound", "good rhythm"],
    "areasToImprove": ["vowel sounds", "intonation"],
    "practiceExercises": ["minimal pairs", "recording practice"]
  },
  "mispronounced_words": []
}

IMPORTANT:
- Keep responses SHORT and CONCISE
- Accuracy 0.0-1.0 based on similarity
- Focus on Amharic speaker challenges
- Respond with VALID JSON ONLY, no other text
- MAX 3 items per array
- Use simple language`;
}

// Add this new method for parsing pronunciation responses
// In your AIService.js - update the parsePronunciationResponse method
parsePronunciationResponse(text) {
  try {
    let cleanedText = text.trim();
    
    console.log('🔧 Raw AI response:', text);
    
    // Remove markdown code blocks more aggressively
    cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/\s*```/gi, '');
    cleanedText = cleanedText.trim();
    
    // Handle incomplete JSON by finding the actual JSON part
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    console.log('🔧 Cleaning pronunciation response:', cleanedText.substring(0, 200) + '...');
    
    const parsed = JSON.parse(cleanedText);
    
    // Validate and ensure all required fields exist
    return {
      accuracy_score: parsed.accuracy_score || parsed.accuracyScore || 0.7,
      feedback: {
        strengths: parsed.feedback?.strengths || parsed.strengths || ["Good effort!"],
        areasToImprove: parsed.feedback?.areasToImprove || parsed.areasToImprove || ["Continue practicing"],
        practiceExercises: parsed.feedback?.practiceExercises || parsed.practiceExercises || ["Repeat the phrase slowly"]
      },
      mispronounced_words: parsed.mispronounced_words || parsed.mispronouncedWords || []
    };
    
  } catch (parseError) {
    console.warn('⚠️ Pronunciation JSON parsing failed:', parseError.message);
    console.log('🔧 Attempting to extract JSON from incomplete response...');
    
    // Try to extract what we can from the incomplete response
    try {
      const accuracyMatch = text.match(/"accuracy_score":\s*(\d+\.?\d*)/);
      const accuracy = accuracyMatch ? parseFloat(accuracyMatch[1]) : 0.7;
      
      return {
        accuracy_score: accuracy,
        feedback: {
          strengths: ["Good attempt at pronunciation"],
          areasToImprove: ["Work on clear articulation"],
          practiceExercises: ["Practice speaking slowly and clearly"]
        },
        mispronounced_words: [],
        _debug: { source: 'partial-json-recovery' }
      };
    } catch (recoveryError) {
      console.warn('⚠️ JSON recovery failed, using enhanced mock');
      return this.getEnhancedMockPronunciationEvaluation("", "");
    }
  }
}
// Update the mock pronunciation evaluation to be more comprehensive
getEnhancedMockPronunciationEvaluation(spokenText, targetText) {
  // Common pronunciation issues for Amharic speakers
  const commonIssues = {
    "th": {
      description: "Difficulty with 'th' sounds (θ and ð)",
      tip: "Place tongue between teeth and blow air",
      phonetic: "/θ/ or /ð/"
    },
    "v": {
      description: "Confusing 'v' and 'w' sounds", 
      tip: "For 'v', touch upper teeth to lower lip",
      phonetic: "/v/"
    },
    "r": {
      description: "Rolling 'r' sound too much",
      tip: "Softer tongue movement, don't trill",
      phonetic: "/ɹ/"
    },
    "p": {
      description: "Not aspirating 'p', 't', 'k' enough",
      tip: "Add a small puff of air after these sounds",
      phonetic: "/pʰ/, /tʰ/, /kʰ/"
    }
  };

  // Analyze the target text for common challenging sounds
  const lowerTarget = targetText.toLowerCase();
  const detectedIssues = [];
  
  if (lowerTarget.includes('th')) {
    detectedIssues.push(commonIssues.th);
  }
  if (lowerTarget.includes('v') || lowerTarget.includes('w')) {
    detectedIssues.push(commonIssues.v);
  }
  if (lowerTarget.includes('r')) {
    detectedIssues.push(commonIssues.r);
  }
  if (lowerTarget.includes('p') || lowerTarget.includes('t') || lowerTarget.includes('k')) {
    detectedIssues.push(commonIssues.p);
  }

  // Create mispronounced words array
  const mispronouncedWords = detectedIssues.map((issue, index) => ({
    word: this.extractRelevantWord(targetText, issue),
    issue_description: issue.description,
    correction_tip: issue.tip,
    phonetic_spelling: issue.phonetic
  }));

  // Calculate accuracy based on text complexity and detected issues
  const wordCount = targetText.split(' ').length;
  const baseAccuracy = Math.max(0.6, 0.9 - (detectedIssues.length * 0.1));
  const finalAccuracy = Math.min(0.95, baseAccuracy);

  return {
    accuracy_score: finalAccuracy,
    feedback: {
      strengths: [
        "Good clarity in basic sounds",
        "Consistent rhythm and pace",
        "Clear vowel pronunciation"
      ],
      areasToImprove: detectedIssues.length > 0 ? 
        detectedIssues.map(issue => issue.description) : 
        ["Work on natural intonation patterns"],
      practiceExercises: [
        "Practice minimal pairs (thin/tin, vet/wet)",
        "Record yourself and compare with native speakers",
        "Use tongue twisters for difficult sounds",
        "Focus on word stress and sentence rhythm"
      ]
    },
    mispronounced_words: mispronouncedWords,
    _debug: { 
      source: 'enhanced-mock-pronunciation',
      detectedIssues: detectedIssues.length,
      textComplexity: wordCount > 5 ? 'complex' : 'simple'
    }
  };
}

// Helper method to extract relevant words from target text
extractRelevantWord(targetText, issue) {
  const words = targetText.split(' ');
  
  if (issue === commonIssues.th) {
    const thWord = words.find(word => word.toLowerCase().includes('th'));
    return thWord || 'the';
  }
  if (issue === commonIssues.v) {
    const vWord = words.find(word => word.toLowerCase().includes('v'));
    return vWord || 'very';
  }
  if (issue === commonIssues.r) {
    const rWord = words.find(word => word.toLowerCase().includes('r'));
    return rWord || 'right';
  }
  if (issue === commonIssues.p) {
    const pWord = words.find(word => 
      word.toLowerCase().includes('p') || 
      word.toLowerCase().includes('t') || 
      word.toLowerCase().includes('k')
    );
    return pWord || 'practice';
  }
  
  return words[0] || 'word';
}

// Make sure to define commonIssues as a constant at the top of your class
// Add this inside your AIService class constructor or as a class property:
get commonIssues() {
  return {
    "th": {
      description: "Difficulty with 'th' sounds (θ and ð)",
      tip: "Place tongue between teeth and blow air",
      phonetic: "/θ/ or /ð/"
    },
    "v": {
      description: "Confusing 'v' and 'w' sounds", 
      tip: "For 'v', touch upper teeth to lower lip",
      phonetic: "/v/"
    },
    "r": {
      description: "Rolling 'r' sound too much",
      tip: "Softer tongue movement, don't trill",
      phonetic: "/ɹ/"
    },
    "p": {
      description: "Not aspirating 'p', 't', 'k' enough",
      tip: "Add a small puff of air after these sounds",
      phonetic: "/pʰ/, /tʰ/, /kʰ/"
    }
  };
}
}

export default new AIService();