import pool from '../../db/connection.js';

export const logoutUser = (request, response) => {
    console.log("logging out...")
    const refreshToken = request.body.token;
    console.log(refreshToken)

    pool.query('DELETE FROM refresh_tokens WHERE refresh_token = $1', [refreshToken], (error, results) => {
        if (error) {
            throw error
        }
        response.sendStatus(204)
    })
}