import pool from "../../db/connection.js";

export const getFlashcards = (request, response) => {
  console.log("getting flashcards...");
  const user_id = request.user.id;
  const { number } = request.body;
  pool.query(
    `SELECT v.id, w.word, t.translation, v.num_seen, v.num_correct, v.progress 
        FROM vocabulary AS v
        LEFT JOIN words AS w ON v.word_id = w.id
        LEFT JOIN translations AS t ON v.translation_id = t.id
        WHERE user_id = $1 ORDER BY random() LIMIT $2;`,
    [user_id, number],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      response.status(200).json(results.rows);
    }
  );
};
