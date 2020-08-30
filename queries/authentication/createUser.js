import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';

export const createUser = async (request, response) => {
    console.log('creating user')
    const { username, email, password, confirmPassword } = request.body;
    
    console.log(
        username,
        email,
        password,
        confirmPassword
        )

    let errors = [];

    if (!username || !email || !password || !confirmPassword) {
        errors.push({ message: 'Please enter all fields' })
    }

    if (password.length < 6) {
        errors.push({ message: 'Password should be at least 6 characters' })
    }

    if (password !== confirmPassword) {
        errors.push({  message: 'Passwords do not match '})
    }

    if (errors.length > 0) {
        console.log('errors detected...')
        response.status(200).send({ errors: errors })
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        pool.query(
            'SELECT * FROM users WHERE email = $1;', [email], (error, results) => {
                if (error) {
                    throw error
                }

                console.log(results.rows);
                
                if (results.rows.length > 0) {
                    errors.push({ message: 'Email already registered' })
                    response.status(200).send({ errors: errors })
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
                        console.log(results.rows)
                        response.status(201).send(`User added with ID: ${results.rows[0].id}`)
                    })
                }
            }
        )
    }
    // hash password

    response.status(201);
    // pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, hashPassword], (error, results) => {
    //     if (error) {
    //         throw error
    //     }
    //     response.status(201).send(`User added with ID: ${result.insertId}`)
    // })
}