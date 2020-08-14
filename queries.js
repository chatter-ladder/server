import pg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_DATABASE'],
    port: process.env['DB_PORT']
})

// users

export const getUsers = (request, response) => {
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

    pool.query('SELECT * FROM users WHERE id = $1;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export const createUser = (request, response) => {
    console.log('creating user')
    const { name, email } = request.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2);', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
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

// vocabulary

export const getVocabulary = (request, response) => {

}

export const createVocabulary = (request, response) => {
    const id = parseInt(request.params.id);
    const { word, word_language, translation, translation_language } = request.body;

    pool.query('INSERT INTO words (word, language) VALUES ($1, $2);', [word, word_language], (error, results) => {
        if (error) {
            throw error
        }

        pool.query('INSERT INTO translations (translation, language) VALUES ($1, $2);', [translation, translation_language], (error, results) => {
            if (error) {
                throw error
            }
        response.sendStatus(201)
        // response.status(201).send(`Translation was added with ID: ${results}`)
    })

    })

}