import pool from "../../db/connection.js";

export const updateVocabulary = (request, response) => {
  console.log(request);
  const vocabList = request.body;
  const user = request.user;

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
      "UPDATE vocabulary SET num_seen = num_seen + $1, num_correct = num_correct + $2, last_seen_at = now() WHERE id = $3;",
      [isSeen, isCorrect, user.id],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  });
  response.status(200);
};
