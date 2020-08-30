import pool from '../../db/connection.js';

export const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    // console.log(id);

    pool.query('SELECT * FROM users WHERE id = $1;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}