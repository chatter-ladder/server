import pool from "../../db/connection.js";

export const updateVocabulary = (request, response) => {
  const user_id = request.user.id;
  const vocabList = request.body;

  vocabList.map((vocab) => {
    let isSeen = 0;
    let isCorrect = 0;
    if (vocab.seen) {
      isSeen = 1;
    }
    if (vocab.correct && vocab.seen) {
      isCorrect = 1;
    }

    pool.query(
      `UPDATE vocabulary 
      SET 
        num_seen = num_seen + $1, 
        num_correct = num_correct + $2, 
        last_seen_at = now() 
      WHERE id = $3;`,
      [isSeen, isCorrect, vocab.id],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  });
  response.status(200).send("vocabulary updated");
};
