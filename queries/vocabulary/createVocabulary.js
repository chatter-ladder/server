import pool from "../../db/connection.js";

export const createVocabulary = (request, response) => {
  // TODO:
  // 1. check if word already exists in db. If so, retrieve word_id, if not create new
  // 2. check if translation already exists in db. If so, retrieve translation_id, if not create new
  // 3. check if word (& language?, & translation?) already exist in user's list. If so, sent error back to user

  const user_id = request.user.id;
  const {
    word,
    word_language,
    translation,
    translation_language,
  } = request.body;

  pool.query(
    `INSERT INTO words (word, language) 
        VALUES ($1, $2) 
        RETURNING id;`,
    [word, word_language],
    (error, result) => {
      if (error) {
        throw error;
      }
      const word_id = result.rows[0].id;

      pool.query(
        `INSERT INTO translations (translation, language) 
            VALUES ($1, $2) 
            RETURNING id;`,
        [translation, translation_language],
        (error, result) => {
          if (error) {
            throw error;
          }
          const translation_id = result.rows[0].id;

          pool.query(
            `INSERT INTO vocabulary (user_id, word_id, translation_id, progress, num_seen, num_correct) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id;`,
            [user_id, word_id, translation_id, "new", 0, 0],
            (error, result) => {
              if (error) {
                throw error;
              }
              response.sendStatus(201);
            }
          );
        }
      );
    }
  );
};
