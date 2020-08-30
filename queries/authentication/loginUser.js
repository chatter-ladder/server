import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export const loginUser = (request, response) => {
    console.log('logging user in');
    const { email, password } = request.body;
    
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

                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                response.json({ accessToken: accessToken })
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