import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';

export const loginUser = (request, response) => {
    console.log('logging user in');
    const { email, password } = request.body;
    
    // console.log(
    //     email,
    //     password
    //     )
    
    // find user
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
                response.send('Success')
            } else {
                response.send("Not allowed")
            }
        } catch {
            response.status(500).send()
        }
        // response.status(200).json(results.rows)
    })

    response.status(201);
}