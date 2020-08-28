import pg from 'pg';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_DATABASE'],
    port: process.env['DB_PORT']
})

// users

export const loginUser = (request, response) => {
    console.log('logging user in');
    const { email, password } = request.body;
    
    console.log(
        email,
        password
        )
    response.status(201);
}

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
    // console.log(id);

    pool.query('SELECT * FROM users WHERE id = $1;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

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
    const id = parseInt(request.params.id)
    // console.log(id)
    pool.query('SELECT w.word, t.translation, v.progress FROM vocabulary AS v LEFT JOIN words AS w ON v.word_id = w.id LEFT JOIN translations AS t ON v.translation_id = t.id WHERE user_id = $1;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export const countVocabulary = (request, response) => {
    const id = parseInt(request.params.id)
    // console.log(id)
    pool.query('SELECT w.word, t.translation, v.progress FROM vocabulary AS v LEFT JOIN words AS w ON v.word_id = w.id LEFT JOIN translations AS t ON v.translation_id = t.id WHERE user_id = $1;', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows.length)
    })
}

export const createVocabulary = (request, response) => {
    const id = parseInt(request.params.id);
    const { user_id, word, word_language, translation, translation_language } = request.body;

    pool.query('INSERT INTO words (word, language) VALUES ($1, $2) RETURNING id;', [word, word_language], (error, result) => {
        if (error) {
            throw error
        }
        const word_id = result.rows[0].id;

        pool.query('INSERT INTO translations (translation, language) VALUES ($1, $2) RETURNING id;', [translation, translation_language], (error, result) => {
            if (error) {
                throw error
            }
            const translation_id = result.rows[0].id;

            pool.query('INSERT INTO vocabulary (user_id, word_id, translation_id, progress, num_seen, num_correct) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;', [user_id, word_id, translation_id, 'new', 0, 0], (error, result) => {
                if (error) {
                    throw error
                }
                response.sendStatus(201)
            })
        // response.status(201).send(`Translation was added with ID: ${results}`)
        })
    })

}

export const getFlashcards = (request, response) => {
    const { user_id, number } = request.body;
    pool.query('SELECT v.id, w.word, t.translation, v.num_seen, v.num_correct, v.progress FROM vocabulary AS v LEFT JOIN words AS w ON v.word_id = w.id LEFT JOIN translations AS t ON v.translation_id = t.id WHERE user_id = $1 ORDER BY random() LIMIT $2;', [user_id, number], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

export const updateVocabulary = (request, response) => {
    const vocabList = request.body

    vocabList.map( vocab => {
        let isSeen = 0
        let isCorrect = 0
        if (vocab.seen) {
            isSeen = 1
        }
        if (vocab.correct && vocab.seen) {
            isCorrect = 1
        }
        pool.query('UPDATE vocabulary SET num_seen = num_seen + $1, num_correct = num_correct + $2, last_seen_at = now() WHERE id = $3;', [isSeen, isCorrect, vocab.id], (error, results) => {
            if (error) {
                throw error
            }
        })
    })
    response.status(200)
}