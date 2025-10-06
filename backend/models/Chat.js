
export const predefinedResponses = {

  'hello': "Hello! I'm your language learning assistant. How can I help you with your language journey today?",
  'hi': "Hi there! Ready to learn some language? What would you like to practice today?",
  'hey': "Hey! I'm here to help with your language learning. What would you like to know?",
  'how are you': "I'm doing great, thanks for asking! I'm here to help you with your language learning. What can I assist you with?",

  'vocabulary': `Here are some effective ways to learn vocabulary:

• Use spaced repetition with flashcards
• Learn words in context with sentences
• Practice with mnemonics and associations
• Use new words in conversations
• Review regularly and consistently`,

  'words': `Here are some effective ways to learn vocabulary:

• Use spaced repetition with flashcards
• Learn words in context with sentences
• Practice with mnemonics and associations
• Use new words in conversations
• Review regularly and consistently`,

  'learn words': `Here are some effective ways to learn vocabulary:

• Use spaced repetition with flashcards
• Learn words in context with sentences
• Practice with mnemonics and associations
• Use new words in conversations
• Review regularly and consistently`,

  // Grammar
  'grammar': `To improve your grammar:

• Practice with targeted exercises
• Read extensively to see grammar in context
• Keep a journal and review it for mistakes
• Learn one grammar rule at a time
• Use grammar check tools as learning aids
• Get feedback from native speakers or teachers`,

  'improve grammar': `To improve your grammar:

• Practice with targeted exercises
• Read extensively to see grammar in context
• Keep a journal and review it for mistakes
• Learn one grammar rule at a time
• Use grammar check tools as learning aids
• Get feedback from native speakers or teachers`,

  // Pronunciation
  'pronunciation': `To improve your pronunciation:

• Listen to native speakers regularly
• Record yourself and compare
• Practice with tongue twisters
• Use pronunciation apps
• Focus on difficult sounds specifically`,

  'improve pronunciation': `To improve your pronunciation:

• Listen to native speakers regularly
• Record yourself and compare
• Practice with tongue twisters
• Use pronunciation apps
• Focus on difficult sounds specifically`,

  // App
  'app': `Welcome to our language learning app! Here's how to get started:

• Complete lessons in the Course Tree to build your skills
• Practice with exercises in each lesson
• Track your progress in your profile
• Join the community to share experiences
• Use the AI tutor for personalized help`,

  'how to use this app': `Welcome to our language learning app! Here's how to get started:

• Complete lessons in the Course Tree to build your skills
• Practice with exercises in each lesson
• Track your progress in your profile
• Join the community to share experiences
• Use the AI tutor for personalized help`,

  'use app': `Welcome to our language learning app! Here's how to get started:

• Complete lessons in the Course Tree to build your skills
• Practice with exercises in each lesson
• Track your progress in your profile
• Join the community to share experiences
• Use the AI tutor for personalized help`,

  // Tips
  'tips': `Here are some great language learning tips:

• Practice a little every day
• Don't be afraid to make mistakes
• Use the language in real situations
• Find content you enjoy (music, movies, books)
• Celebrate small victories along the way!`,

  'advice': `Here are some great language learning tips:

• Practice a little every day
• Don't be afraid to make mistakes
• Use the language in real situations
• Find content you enjoy (music, movies, books)
• Celebrate small victories along the way!`,

  'any tips': `Here are some great language learning tips:

• Practice a little every day
• Don't be afraid to make mistakes
• Use the language in real situations
• Find content you enjoy (music, movies, books)
• Celebrate small victories along the way!`,
};



export const findBestResponse = (userMessage) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return "Please type a message! I'm here to help with language learning.";
  }

  const message = userMessage.toLowerCase().trim();



  const exactMatch = predefinedResponses[message];
  if (exactMatch) {
    return exactMatch;
  }

  const keywordResponses = [
    { keywords: ['hello', 'hi', 'hey'], response: predefinedResponses['hello'] },
    { keywords: ['vocabulary', 'words', 'learn words'], response: predefinedResponses['vocabulary'] },
    { keywords: ['grammar', 'improve grammar'], response: predefinedResponses['grammar'] },
    { keywords: ['pronunciation', 'improve pronunciation'], response: predefinedResponses['pronunciation'] },
    { keywords: ['app', 'use app', 'how to use'], response: predefinedResponses['app'] },
    { keywords: ['tips', 'advice', 'any tips'], response: predefinedResponses['tips'] },
  ];

  for (const { keywords, response } of keywordResponses) {
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        return response;
      }
    }
  }

  if (message.includes('how to')) {
    return "I'd be happy to help with that! Could you be more specific? For example: 'how to improve vocabulary' or 'how to use the app'?";
  }

  // fallback
  return "I'm here to help with language learning! Try asking about:\n\n• Vocabulary learning\n• Grammar tips\n• Pronunciation practice\n• Using our app\n• Learning strategies";
};