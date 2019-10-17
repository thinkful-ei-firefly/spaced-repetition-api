BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("username", "name", "password")
VALUES
  (
    'demo',
    'Demo Arigatou',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Japanese', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'hai', 'yes', 2),
  (2, 1, 'iie', 'no', 3),
  (3, 1, 'ohayo gozaimasu', 'good morning', 4),
  (4, 1, 'konnichiwa', 'hello/good day', 5),
  (5, 1, 'hajimemashite', 'nice to meet you', 6),
  (6, 1, 'arigato', 'thank you', 7),
  (7, 1, 'sumimasen', 'excuse me', 8),
  (8, 1, 'gomennasai', 'sorry', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
