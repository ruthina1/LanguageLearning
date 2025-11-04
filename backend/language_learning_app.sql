CREATE DATABASE language_learning_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE language_learning_app;

--  USERS TABLE

select *  from users;
CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  avatar_url VARCHAR(512),
  native_language VARCHAR(64),
  target_language VARCHAR(64),
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  accuracy DOUBLE DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- LESSONS TABLE

CREATE TABLE lessons (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skill VARCHAR(50),
  difficulty VARCHAR(50),
  estimated_time INT,
  xp_reward INT,
  content JSON,
  tags JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  level INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  USER_PROGRESS TABLE

CREATE TABLE user_progress (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  current_level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  streak INT DEFAULT 0,
  accuracy DOUBLE DEFAULT 0,
  last_active DATETIME NULL,
  grammar_level INT DEFAULT 0,
  grammar_xp INT DEFAULT 0,
  grammar_accuracy DOUBLE DEFAULT 0,
  vocabulary_level INT DEFAULT 0,
  vocabulary_xp INT DEFAULT 0,
  vocabulary_accuracy DOUBLE DEFAULT 0,
  speaking_level INT DEFAULT 0,
  speaking_xp INT DEFAULT 0,
  speaking_accuracy DOUBLE DEFAULT 0,
  listening_level INT DEFAULT 0,
  listening_xp INT DEFAULT 0,
  listening_accuracy DOUBLE DEFAULT 0,
  writing_level INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  weekly_progress TEXT,
  weak_areas TEXT,
  lessons_completed TEXT,
  CONSTRAINT fk_userprogress_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_userprogress_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- USER_LESSONS TABLE

CREATE TABLE user_lessons (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  lesson_id INT NOT NULL,
  completed_at DATETIME,
  CONSTRAINT fk_userlessons_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_userlessons_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_userlessons_user (user_id),
  INDEX idx_userlessons_lesson (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DAILY_PROGRESS TABLE

CREATE TABLE daily_progress (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  date DATE NOT NULL,
  xp INT DEFAULT 0,
  lessons_completed TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_daily_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_daily_user (user_id),
  INDEX idx_daily_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- COMMUNITY_POSTS TABLE


CREATE TABLE community_posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  avater VARCHAR(512),
  user_level INT DEFAULT 0,
  type VARCHAR(50) DEFAULT 'text',
  content TEXT NOT NULL,
  related_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_posts_user (user_id),
  INDEX idx_posts_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE community_posts CHANGE COLUMN avater avatar_url VARCHAR(512);
-- POST_COMMENTS TABLE
ALTER TABLE community_posts
ADD COLUMN avatar_url VARCHAR(255) DEFAULT '👤';

DESCRIBE community_posts;



CREATE TABLE post_comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id CHAR(36) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES community_posts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_comments_post (post_id),
  INDEX idx_comments_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- POST_LIKES TABLE

CREATE TABLE post_likes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES community_posts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_post_user (post_id, user_id),
  INDEX idx_likes_post (post_id),
  INDEX idx_likes_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- ================================
-- LEVEL 1 (Beginner) – 6 Lessons
-- ================================

INSERT INTO lessons (title, description, skill, difficulty, estimated_time, xp_reward, content, tags, is_active, level, created_at, updated_at) VALUES

-- Lesson 1
('Greetings & Introductions', 'Learn greetings and self-introduction', 'conversation', 'beginner', 15, 50,
'{
  "lesson_overview": "This lesson teaches you how to greet people and introduce yourself politely.",
  "vocabulary": ["hello","hi","good morning","good evening","goodbye","see you later","what\'s up?","nice to meet you","how are you?","have a nice day"],
  "exercises": [
    {"type": "fill_in_blank","question": "___, how are you?","answer":"Hello"},
    {"type": "multiple_choice","question": "How do you say goodbye?","options": ["Hi","Goodbye","Morning"],"answer":"Goodbye"},
    {"type": "matching","question": "Match greeting to time","pairs": {"Good morning":"Morning","Good evening":"Evening"}},
    {"type": "fill_in_blank","question": "Nice to ___ you.","answer":"meet"},
    {"type": "multiple_choice","question": "Which greeting is informal?","options":["Hello","Good evening","Good morning"],"answer":"Hello"},
    {"type": "fill_in_blank","question": "See you ___!","answer":"later"},
    {"type": "matching","question": "Match phrases to meaning","pairs": {"What\'s up?":"How are you?"}},
    {"type": "fill_in_blank","question": "Have a ___ day!","answer":"nice"},
    {"type": "multiple_choice","question": "How do you greet in the evening?","options":["Good evening","Good night","Hello"],"answer":"Good evening"},
    {"type": "fill_in_blank","question": "___ is your first greeting word?","answer":"Hello"}
  ],
  "tip": "Always greet people politely. Using \'hello\' is safe in any situation."
}', '["greetings","conversation","beginner"]', true, 1, NOW(), NOW()),

-- Lesson 2
('Numbers 1-10', 'Learn numbers from 1 to 10', 'vocabulary', 'beginner', 15, 45,
'{
  "lesson_overview": "Learn the numbers from 1 to 10 and practice counting.",
  "vocabulary": ["one","two","three","four","five","six","seven","eight","nine","ten"],
  "exercises": [
    {"type": "fill_in_blank","question": "Number after three is ___","answer":"four"},
    {"type": "multiple_choice","question": "What is 5+2?","options":["6","7","8"],"answer":"7"},
    {"type": "matching","question": "Match number to word","pairs": {"1":"one","2":"two","3":"three"}},
    {"type": "fill_in_blank","question": "Number before ten is ___","answer":"nine"},
    {"type": "multiple_choice","question": "Which number is even?","options":["3","4","5"],"answer":"4"},
    {"type": "fill_in_blank","question": "Number after six is ___","answer":"seven"},
    {"type": "matching","question": "Match number to spelling","pairs": {"8":"eight","9":"nine"}},
    {"type": "fill_in_blank","question": "Number after two is ___","answer":"three"},
    {"type": "multiple_choice","question": "Which number is odd?","options":["2","4","5"],"answer":"5"},
    {"type": "fill_in_blank","question": "Number before three is ___","answer":"two"}
  ],
  "tip": "Practice counting out loud to remember numbers better."
}', '["numbers","vocabulary","beginner"]', true, 1, NOW(), NOW()),

-- Lesson 3
('Colors & Shapes', 'Learn basic colors and shapes', 'vocabulary', 'beginner', 15, 45,
'{
  "lesson_overview": "Learn common colors and basic shapes in English.",
  "vocabulary": ["red","blue","green","yellow","black","white","circle","square","triangle","rectangle"],
  "exercises": [
    {"type":"fill_in_blank","question":"The color of the sky is ___","answer":"blue"},
    {"type":"multiple_choice","question":"Which is a shape?","options":["Red","Circle","Green"],"answer":"Circle"},
    {"type":"matching","question":"Match color to object","pairs":{"Red":"Apple","Yellow":"Banana","Green":"Leaf"}},
    {"type":"fill_in_blank","question":"The sun is ___","answer":"yellow"},
    {"type":"multiple_choice","question":"Which color is dark?","options":["White","Black","Yellow"],"answer":"Black"},
    {"type":"fill_in_blank","question":"A square has ___ sides","answer":"four"},
    {"type":"matching","question":"Match shape to sides","pairs":{"Triangle":"3","Rectangle":"4"}},
    {"type":"fill_in_blank","question":"A circle has ___ corners","answer":"zero"},
    {"type":"multiple_choice","question":"Which color is not primary?","options":["Red","Green","Blue"],"answer":"Green"},
    {"type":"fill_in_blank","question":"Grass is ___","answer":"green"}
  ],
  "tip":"Colors help describe objects. Shapes are important for basic geometry."
}', '["colors","shapes","vocabulary","beginner"]', true, 1, NOW(), NOW()),

-- Lesson 4
('Family & People', 'Learn family members and basic people vocabulary', 'vocabulary', 'beginner', 15, 50,
'{
  "lesson_overview":"Learn names of family members and people around you.",
  "vocabulary":["mother","father","sister","brother","grandmother","grandfather","friend","teacher","child","baby"],
  "exercises":[
    {"type":"fill_in_blank","question":"My ___ is very kind.","answer":"mother"},
    {"type":"multiple_choice","question":"Who is your male parent?","options":["Mother","Father","Brother"],"answer":"Father"},
    {"type":"matching","question":"Match relation to person","pairs":{"Sister":"Female sibling","Brother":"Male sibling"}},
    {"type":"fill_in_blank","question":"My ___ loves me.","answer":"father"},
    {"type":"multiple_choice","question":"Who is the teacher?","options":["Student","Teacher","Child"],"answer":"Teacher"},
    {"type":"fill_in_blank","question":"My ___ is old.","answer":"grandmother"},
    {"type":"matching","question":"Match family word to image","pairs":{"Baby":"Infant","Friend":"Pal"}},
    {"type":"fill_in_blank","question":"My ___ is playful.","answer":"child"},
    {"type":"multiple_choice","question":"Which word means \'male sibling\'?","options":["Sister","Brother","Grandmother"],"answer":"Brother"},
    {"type":"fill_in_blank","question":"My ___ is my pal.","answer":"friend"}
  ],
  "tip":"Family words are essential for introductions and talking about people."
}', '["family","people","vocabulary","beginner"]', true, 1, NOW(), NOW()),

-- Lesson 5
('Basic Verbs', 'Learn common verbs in English', 'grammar', 'beginner', 15, 50,
'{
  "lesson_overview":"Learn common action words and their usage.",
  "vocabulary":["eat","drink","go","come","play","read","write","sleep","run","walk"],
  "exercises":[
    {"type":"fill_in_blank","question":"I ___ water.","answer":"drink"},
    {"type":"multiple_choice","question":"Which word means to move fast?","options":["Run","Eat","Sleep"],"answer":"Run"},
    {"type":"matching","question":"Match verb to meaning","pairs":{"Eat":"Consume food","Sleep":"Rest"}},
    {"type":"fill_in_blank","question":"I ___ a book.","answer":"read"},
    {"type":"multiple_choice","question":"Which verb is for leisure?","options":["Play","Go","Come"],"answer":"Play"},
    {"type":"fill_in_blank","question":"I ___ to school.","answer":"go"},
    {"type":"matching","question":"Match verb to pronoun usage","pairs":{"Walk":"I walk","Run":"He runs"}},
    {"type":"fill_in_blank","question":"I ___ in the bed.","answer":"sleep"},
    {"type":"multiple_choice","question":"Which verb is for movement?","options":["Eat","Go","Drink"],"answer":"Go"},
    {"type":"fill_in_blank","question":"I ___ football.","answer":"play"}
  ],
  "tip":"Practice verbs by making simple sentences like \'I eat\', \'You play\'."
}', '["verbs","grammar","beginner"]', true, 1, NOW(), NOW()),

-- Lesson 6
('Simple Questions', 'Learn how to ask basic questions', 'conversation', 'beginner', 15, 50,
'{
  "lesson_overview":"Learn to ask and answer simple questions in English.",
  "vocabulary":["what","where","who","when","why","how","which","name","time","place"],
  "exercises":[
    {"type":"fill_in_blank","question":"___ is your name?","answer":"What"},
    {"type":"multiple_choice","question":"Which word asks location?","options":["Who","Where","How"],"answer":"Where"},
    {"type":"matching","question":"Match question word to meaning","pairs":{"When":"Time","Who":"Person","Where":"Place"}},
    {"type":"fill_in_blank","question":"___ are you?","answer":"Who"},
    {"type":"multiple_choice","question":"Which word asks reason?","options":["Why","How","Which"],"answer":"Why"},
    {"type":"fill_in_blank","question":"___ is the time?","answer":"What"},
    {"type":"matching","question":"Match word to sentence","pairs":{"How":"How are you?","What":"What is this?"}},
    {"type":"fill_in_blank","question":"___ is your favorite color?","answer":"What"},
    {"type":"multiple_choice","question":"Which asks method?","options":["How","Who","When"],"answer":"How"},
    {"type":"fill_in_blank","question":"___ did you go there?","answer":"How"}
  ],
  "tip":"Practice asking simple questions to communicate effectively."
}', '["questions","conversation","beginner"]', true, 1, NOW(), NOW());

-- ================================
-- LEVEL 2 (Elementary) – 6 Lessons
-- ================================

INSERT INTO lessons (title, description, skill, difficulty, estimated_time, xp_reward, content, tags, is_active, level, created_at, updated_at) VALUES

-- Lesson 7
('Food & Drinks', 'Learn food and drink vocabulary', 'vocabulary', 'elementary', 20, 60,
'{
  "lesson_overview":"Learn common foods and drinks.",
  "vocabulary":["water","bread","milk","apple","rice","tea","coffee","egg","chicken","fish"],
  "exercises":[
    {"type":"fill_in_blank","question":"I drink ___","answer":"water"},
    {"type":"multiple_choice","question":"Which is a drink?","options":["Apple","Milk","Bread"],"answer":"Milk"},
    {"type":"matching","question":"Match food to category","pairs":{"Apple":"Fruit","Rice":"Grain","Chicken":"Meat"}},
    {"type":"fill_in_blank","question":"I eat ___","answer":"bread"},
    {"type":"multiple_choice","question":"Which is a fruit?","options":["Fish","Apple","Egg"],"answer":"Apple"},
    {"type":"fill_in_blank","question":"I have ___ for breakfast","answer":"egg"},
    {"type":"matching","question":"Match drink to type","pairs":{"Tea":"Hot","Coffee":"Hot","Water":"Cold"}},
    {"type":"fill_in_blank","question":"I drink ___ in the morning","answer":"tea"},
    {"type":"multiple_choice","question":"Which is meat?","options":["Milk","Chicken","Apple"],"answer":"Chicken"},
    {"type":"fill_in_blank","question":"I eat ___ at lunch","answer":"rice"}
  ],
  "tip":"Learn foods you eat every day to communicate easily in restaurants."
}', '["food","vocabulary","elementary"]', true, 2, NOW(), NOW()),

-- Lesson 8
('Clothes', 'Learn clothes vocabulary', 'vocabulary', 'elementary', 15, 50,
'{
  "lesson_overview":"Learn common clothes vocabulary.",
  "vocabulary":["shirt","pants","dress","skirt","shoes","hat","coat","socks","tie","jacket"],
  "exercises":[
    {"type":"fill_in_blank","question":"I wear a ___","answer":"shirt"},
    {"type":"multiple_choice","question":"Which is worn on feet?","options":["Hat","Shoes","Tie"],"answer":"Shoes"},
    {"type":"matching","question":"Match item to body part","pairs":{"Hat":"Head","Shoes":"Feet","Coat":"Body"}},
    {"type":"fill_in_blank","question":"I wear a ___ in winter","answer":"coat"},
    {"type":"multiple_choice","question":"Which is for neck?","options":["Tie","Shirt","Hat"],"answer":"Tie"},
    {"type":"fill_in_blank","question":"I wear ___ on my head","answer":"hat"},
    {"type":"matching","question":"Match clothes to season","pairs":{"Coat":"Winter","T-shirt":"Summer","Jacket":"Winter"}},
    {"type":"fill_in_blank","question":"I wear ___ on my legs","answer":"pants"},
    {"type":"multiple_choice","question":"Which is formal?","options":["Shirt","Socks","Hat"],"answer":"Shirt"},
    {"type":"fill_in_blank","question":"I wear ___ on my feet","answer":"shoes"}
  ],
  "tip":"Learning clothes vocabulary helps when shopping or describing outfits."
}', '["clothes","vocabulary","elementary"]', true, 2, NOW(), NOW()),

-- Lesson 9
('Animals', 'Learn common animals', 'vocabulary', 'elementary', 15, 50,
'{
  "lesson_overview":"Learn names of common animals.",
  "vocabulary":["cat","dog","bird","cow","horse","sheep","pig","fish","lion","tiger"],
  "exercises":[
    {"type":"fill_in_blank","question":"A ___ barks","answer":"dog"},
    {"type":"multiple_choice","question":"Which animal says meow?","options":["Dog","Cat","Cow"],"answer":"Cat"},
    {"type":"matching","question":"Match animal to sound","pairs":{"Dog":"Bark","Cat":"Meow","Cow":"Moo"}},
    {"type":"fill_in_blank","question":"A ___ gives milk","answer":"cow"},
    {"type":"multiple_choice","question":"Which animal is wild?","options":["Sheep","Lion","Dog"],"answer":"Lion"},
    {"type":"fill_in_blank","question":"A ___ has stripes","answer":"tiger"},
    {"type":"matching","question":"Match animal to category","pairs":{"Fish":"Water","Horse":"Land","Bird":"Air"}},
    {"type":"fill_in_blank","question":"A ___ flies","answer":"bird"},
    {"type":"multiple_choice","question":"Which animal is a pet?","options":["Lion","Cat","Tiger"],"answer":"Cat"},
    {"type":"fill_in_blank","question":"A ___ says oink","answer":"pig"}
  ],
  "tip":"Animal words are useful in conversations and stories."
}', '["animals","vocabulary","elementary"]', true, 2, NOW(), NOW()),

-- Lesson 10
('Days & Months', 'Learn days of the week and months', 'vocabulary', 'elementary', 15, 50,
'{
  "lesson_overview":"Learn names of days and months.",
  "vocabulary":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","January","February","March"],
  "exercises":[
    {"type":"fill_in_blank","question":"First day of week is ___","answer":"Monday"},
    {"type":"multiple_choice","question":"Which is a month?","options":["Monday","January","Friday"],"answer":"January"},
    {"type":"matching","question":"Match day to abbreviation","pairs":{"Monday":"Mon","Tuesday":"Tue","Wednesday":"Wed"}},
    {"type":"fill_in_blank","question":"The weekend day is ___","answer":"Saturday"},
    {"type":"multiple_choice","question":"Which day comes after Thursday?","options":["Wednesday","Friday","Monday"],"answer":"Friday"},
    {"type":"fill_in_blank","question":"Month after January is ___","answer":"February"},
    {"type":"matching","question":"Match month to season","pairs":{"January":"Winter","March":"Spring","February":"Winter"}},
    {"type":"fill_in_blank","question":"Month after February is ___","answer":"March"},
    {"type":"multiple_choice","question":"Which day is weekday?","options":["Sunday","Tuesday","Saturday"],"answer":"Tuesday"},
    {"type":"fill_in_blank","question":"Last day of week is ___","answer":"Sunday"}
  ],
  "tip":"Remembering days and months helps in making plans and conversations."
}', '["days","months","vocabulary","elementary"]', true, 2, NOW(), NOW()),

-- Lesson 11
('Weather & Seasons', 'Learn weather and seasons', 'vocabulary', 'elementary', 15, 50,
'{
  "lesson_overview":"Learn basic weather terms and seasons.",
  "vocabulary":["sunny","rainy","cloudy","windy","snowy","spring","summer","autumn","winter","hot"],
  "exercises":[
    {"type":"fill_in_blank","question":"The sun makes it ___","answer":"sunny"},
    {"type":"multiple_choice","question":"Which season is cold?","options":["Summer","Winter","Spring"],"answer":"Winter"},
    {"type":"matching","question":"Match weather to season","pairs":{"Snowy":"Winter","Sunny":"Summer","Windy":"Autumn"}},
    {"type":"fill_in_blank","question":"It rains when it is ___","answer":"rainy"},
    {"type":"multiple_choice","question":"Which is windy season?","options":["Summer","Autumn","Winter"],"answer":"Autumn"},
    {"type":"fill_in_blank","question":"Hot season is ___","answer":"summer"},
    {"type":"matching","question":"Match season to temperature","pairs":{"Summer":"Hot","Winter":"Cold","Spring":"Mild"}},
    {"type":"fill_in_blank","question":"Cold season is ___","answer":"winter"},
    {"type":"multiple_choice","question":"Which season is for flowers?","options":["Winter","Spring","Autumn"],"answer":"Spring"},
    {"type":"fill_in_blank","question":"It is ___ when clouds cover the sky","answer":"cloudy"}
  ],
  "tip":"Talking about weather helps in daily conversation."
}', '["weather","seasons","vocabulary","elementary"]', true, 2, NOW(), NOW()),

-- Lesson 12
('Hobbies & Free Time', 'Learn vocabulary about hobbies', 'vocabulary', 'elementary', 15, 50,
'{
  "lesson_overview":"Learn common hobbies and activities.",
  "vocabulary":["reading","writing","swimming","running","painting","singing","dancing","cooking","gaming","traveling"],
  "exercises":[
    {"type":"fill_in_blank","question":"I like ___ books.","answer":"reading"},
    {"type":"multiple_choice","question":"Which is a physical activity?","options":["Gaming","Running","Writing"],"answer":"Running"},
    {"type":"matching","question":"Match hobby to type","pairs":{"Painting":"Art","Swimming":"Sport","Singing":"Art"}},
    {"type":"fill_in_blank","question":"I enjoy ___ music.","answer":"singing"},
    {"type":"multiple_choice","question":"Which hobby uses computer?","options":["Gaming","Dancing","Cooking"],"answer":"Gaming"},
    {"type":"fill_in_blank","question":"I ___ in the pool.","answer":"swim"},
    {"type":"matching","question":"Match hobby to object","pairs":{"Painting":"Brush","Cooking":"Pan","Running":"Shoes"}},
    {"type":"fill_in_blank","question":"I like ___ food.","answer":"cooking"},
    {"type":"multiple_choice","question":"Which is artistic hobby?","options":["Swimming","Painting","Running"],"answer":"Painting"},
    {"type":"fill_in_blank","question":"I enjoy ___ dance.","answer":"dancing"}
  ],
  "tip":"Hobbies help you talk about yourself and your interests."
}', '["hobbies","vocabulary","elementary"]', true, 2, NOW(), NOW());

-- ================================
-- LEVEL 3 (Intermediate) – 6 Lessons
-- ================================

INSERT INTO lessons (title, description, skill, difficulty, estimated_time, xp_reward, content, tags, is_active, level, created_at, updated_at) VALUES

-- Lesson 13
('Present Tense', 'Learn present tense verbs', 'grammar', 'intermediate', 20, 60,
'{
  "lesson_overview":"Learn how to use present tense in sentences.",
  "vocabulary":["am","is","are","eat","drink","go","come","play","read","write"],
  "exercises":[
    {"type":"fill_in_blank","question":"I ___ a book every day.","answer":"read"},
    {"type":"multiple_choice","question":"She ___ happy.","options":["am","is","are"],"answer":"is"},
    {"type":"matching","question":"Match pronoun to verb","pairs":{"I":"am","He":"is","They":"are"}},
    {"type":"fill_in_blank","question":"They ___ to school.","answer":"go"},
    {"type":"multiple_choice","question":"I ___ coffee every morning.","options":["drink","drinks","drank"],"answer":"drink"},
    {"type":"fill_in_blank","question":"He ___ football on weekends.","answer":"plays"},
    {"type":"matching","question":"Match verb to subject","pairs":{"Come":"They come","Play":"I play"}},
    {"type":"fill_in_blank","question":"She ___ a letter.","answer":"writes"},
    {"type":"multiple_choice","question":"We ___ happy today.","options":["is","are","am"],"answer":"are"},
    {"type":"fill_in_blank","question":"I ___ breakfast at 7 am.","answer":"eat"}
  ],
  "tip":"Practice present tense by talking about daily routines."
}', '["grammar","present","intermediate"]', true, 3, NOW(), NOW()),

-- Lesson 14
('Past Tense', 'Learn past tense verbs', 'grammar', 'intermediate', 20, 60,
'{
  "lesson_overview":"Learn simple past tense for regular and common verbs.",
  "vocabulary":["went","ate","drank","saw","played","read","wrote","ran","slept","cooked"],
  "exercises":[
    {"type":"fill_in_blank","question":"Yesterday I ___ a book.","answer":"read"},
    {"type":"multiple_choice","question":"He ___ to the park.","options":["go","went","gone"],"answer":"went"},
    {"type":"matching","question":"Match present to past","pairs":{"eat":"ate","drink":"drank","play":"played"}},
    {"type":"fill_in_blank","question":"She ___ a cake yesterday.","answer":"baked"},
    {"type":"multiple_choice","question":"I ___ TV last night.","options":["watch","watched","watches"],"answer":"watched"},
    {"type":"fill_in_blank","question":"They ___ football yesterday.","answer":"played"},
    {"type":"matching","question":"Match verb to past","pairs":{"run":"ran","sleep":"slept","write":"wrote"}},
    {"type":"fill_in_blank","question":"He ___ a letter yesterday.","answer":"wrote"},
    {"type":"multiple_choice","question":"We ___ breakfast earlier.","options":["eat","ate","eaten"],"answer":"ate"},
    {"type":"fill_in_blank","question":"She ___ to the market.","answer":"went"}
  ],
  "tip":"Remember to practice both regular and irregular past verbs."
}', '["grammar","past","intermediate"]', true, 3, NOW(), NOW()),

-- Lesson 15
('Future Tense', 'Learn future tense sentences', 'grammar', 'intermediate', 20, 60,
'{
  "lesson_overview":"Learn how to use \'will\' and \'going to\' for future actions.",
  "vocabulary":["will","going to","shall","plan","tomorrow","next","later","hope","intend","promise"],
  "exercises":[
    {"type":"fill_in_blank","question":"I ___ go to school tomorrow.","answer":"will"},
    {"type":"multiple_choice","question":"We ___ visit our friends next week.","options":["will","went","going to"],"answer":"will"},
    {"type":"matching","question":"Match phrase to usage","pairs":{"will":"Decision","going to":"Plan"}},
    {"type":"fill_in_blank","question":"She ___ start a new project.","answer":"will"},
    {"type":"multiple_choice","question":"He ___ travel next month.","options":["going to","went","will"],"answer":"going to"},
    {"type":"fill_in_blank","question":"They ___ meet us later.","answer":"will"},
    {"type":"matching","question":"Match sentence to tense","pairs":{"I will eat":"Future","I went":"Past"}},
    {"type":"fill_in_blank","question":"I ___ buy a gift.","answer":"will"},
    {"type":"multiple_choice","question":"We ___ attend the party.","options":["will","went","going to"],"answer":"will"},
    {"type":"fill_in_blank","question":"She ___ study tonight.","answer":"will"}
  ],
  "tip":"Future tense helps you talk about plans and predictions."
}', '["grammar","future","intermediate"]', true, 3, NOW(), NOW());

CREATE TABLE user_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id CHAR(36) NOT NULL,
  activity_type ENUM('lesson', 'practice', 'quiz', 'exercise') NOT NULL,
  skill VARCHAR(50) NOT NULL,
  xp_earned INT NOT NULL DEFAULT 0,
  duration INT DEFAULT 0, -- in minutes
  accuracy DECIMAL(5,2) DEFAULT 0.00,
  lesson_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, created_at),
  INDEX idx_skill (skill),
  INDEX idx_activity_type (activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at);
CREATE INDEX idx_user_activities_skill ON user_activities(skill);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);



CREATE TABLE user_goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id CHAR(36) NOT NULL,
  daily_goal_minutes INT DEFAULT 30,
  weekly_goal_days INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_goals (user_id)
);