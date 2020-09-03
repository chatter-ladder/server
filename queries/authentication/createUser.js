import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (request, response) => {
    const { username, email, password, confirmPassword } = request.body;
    
    // let errors = [];

    if (!username || !email || !password || !confirmPassword) {
        // errors.push({ message: 'Please enter all fields' })
        return response.status(400).send({ error: 'Please enter all fields' })
    }

    if (password.length < 6) {
        // errors.push({ message: 'Password should be at least 6 characters' })
        return response.status(400).send({ error: 'Password should be at least 6 characters' })
    }

    if (password !== confirmPassword) {
        // errors.push({  message: 'Passwords do not match '})
        return response.status(400).send({ error: 'Passwords do not match' })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
        
    pool.query(
        'SELECT * FROM users WHERE email = $1;', [email], (error, results) => {
            if (error) {
                throw error
            }
            
            if (results.rows.length > 0) {
                // errors.push({ message: 'Email already registered' })
                response.status(400).send({ error: 'Email already registered' })
            } else {
                pool.query(
                    `INSERT INTO users (name, email, password) 
                    VALUES ($1, $2, $3)
                    RETURNING id, password`, 
                    [username, email, hashedPassword], 
                    (error, results) => {
                    if (error) {
                        throw error
                    }

                    const accessToken = jwt.sign({ id: results.rows[0].id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
                    const refreshToken = jwt.sign({ id: results.rows[0].id }, process.env.REFRESH_TOKEN_SECRET)
    
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
                    console.log('creating user...')
                    response.status(201).send({ userId: results.rows[0].id, accessToken: accessToken, expiresIn: '3600', refreshToken: refreshToken })
                })
            }
        }
    )
    // }
}