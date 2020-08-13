import pg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_DATABASE'],
    port: process.env['DB_PORT']
})

export const getUsers = (request, response) => {
    console.log('requesting...')
    pool.query('SELECT * FROM users ORDER BY id ASC;', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export const createUser = (request, response) => {
    const { name, email } = request.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

export const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

export const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELECT FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}