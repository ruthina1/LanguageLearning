CREATE database lingualearn_db;

USE lingualearn_db;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500) DEFAULT '👤',
    level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (id, email, username, password_hash, display_name, level, total_xp) VALUES
(UUID(), 'ruthgizat@gmail.com', 'ruth', '$2b$10$ExampleHash', 'Ruth Gizat', 5, 1250),
(UUID(), 'betel@gmail.com', 'betel', '$2b$10$ExampleHash', 'Betel Gizat', 3, 800);

ALTER TABLE users 
ADD COLUMN native_language VARCHAR(10) DEFAULT 'am',
ADD COLUMN target_language VARCHAR(10) DEFAULT 'en';

INSERT INTO users (email, username, password_hash, display_name, native_language, target_language, level, total_xp, current_streak, best_streak) VALUES
('abelgizat@gmail.com', 'abel', '$2a$10$rQzZ2VhN2VhN2VhN2VhN2OeN2VhN2VhN2VhN2VhN2VhN2VhN2VhN2', 'Abel Gizat', 'amharic', 'english', 10, 2500, 15, 30);

select * from lessons;
SELECT * from users;
SELECT * from progress;
SELECT * from user_lessons;
SELECT * from user_progress;

 show tables;

select * from community_posts;
select * from  post_comments;
select * from post_likes;
select * from users;
ALTER TABLE user_progress
ADD COLUMN lessons_completed TEXT;



