import pool from '../../db/connection.js';

export const getVocabulary = (request, response) => {
    const id = parseInt(request.params.id)
    
    pool.query('SELECT w.word, t.translation, v.progress FROM vocabulary AS v LEFT JOIN words AS w ON v.word_id = w.id LEFT JOIN translations AS t ON v.translation_id = t.id WHERE user_id = $1;', [request.user.id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}