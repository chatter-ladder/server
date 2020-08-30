import pool from '../../db/connection.js';

export const createVocabulary = (request, response) => {
    const id = parseInt(request.params.id);
    const { user_id, word, word_language, translation, translation_language } = request.body;

    pool.query('INSERT INTO words (word, language) VALUES ($1, $2) RETURNING id;', [word, word_language], (error, result) => {
        if (error) {
            throw error
        }
        const word_id = result.rows[0].id;

        pool.query('INSERT INTO translations (translation, language) VALUES ($1, $2) RETURNING id;', [translation, translation_language], (error, result) => {
            if (error) {
                throw error
            }
            const translation_id = result.rows[0].id;

            pool.query('INSERT INTO vocabulary (user_id, word_id, translation_id, progress, num_seen, num_correct) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;', [user_id, word_id, translation_id, 'new', 0, 0], (error, result) => {
                if (error) {
                    throw error
                }
                response.sendStatus(201)
            })
        })
    })

}