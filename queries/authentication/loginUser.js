import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export const loginUser = (request, response) => {
    console.log('logging user in');
    const { email, password } = request.body;

    console.log(email, password)
    
    // Authenticate User:
    pool.query('SELECT * FROM users WHERE email = $1;', [email], async (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        
        if (results.rows.length === 0) {
            return response.status(400).send('Cannot find user')
        }
        try {
            if (await bcrypt.compare(request.body.password, results.rows[0].password)) {
                // response.send('Success')

                const username = results.rows[0].username
                const user = results.rows[0]

                const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
                const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET)
                // Need to save refresh token to db

                pool.query(
                    `INSERT INTO refresh_tokens (refresh_token)
                    VALUES ($1)`, [refreshToken],
                    (error, results) => {
                        if (error) {
                            throw error
                        }
                        console.log('refresh token saved to db')
                    }
                )

                response.json({ accessToken: accessToken, expiresIn: "3600", refreshToken: refreshToken })
            } else {
                response.send("Not allowed")
            }
        } catch {
            response.status(500).send()
        }
        // response.status(200).json(results.rows)
    })

    // response.status(201);
}