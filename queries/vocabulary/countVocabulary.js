import pool from "../../db/connection.js";

export const countVocabulary = (request, response) => {
  const user_id = request.user.id;
  pool.query(
    `SELECT w.word, t.translation, v.progress 
        FROM vocabulary AS v 
        LEFT JOIN words AS w ON v.word_id = w.id 
        LEFT JOIN translations AS t ON v.translation_id = t.id 
        WHERE user_id = $1;`,
    [user_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows.length);
    }
  );
};
