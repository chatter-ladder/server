import pool from '../../db/connection.js';
import bcrypt from 'bcrypt';

export const loginUser = (request, response) => {
    console.log('logging user in');
    const { email, password } = request.body;
    
    console.log(
        email,
        password
        )
    response.status(201);
}