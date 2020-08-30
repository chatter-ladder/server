import pool from '../../db/connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export const updateToken = (request, response) => {
    const refreshToken = request.body.token
    if (refreshToken === null) return response.sendStatus(401)
    
    pool.query(
        `SELECT * FROM refresh_tokens
        WHERE refresh_token = $1`, [refreshToken],
        (error, results) => {
            if (error) {
                throw error
            }
            if (!results.rows.length >0) return response.sendStatus(403)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if (error) return response.sendStatus(403)
                const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
                response.json({ accessToken })
            })
        }
    )
}