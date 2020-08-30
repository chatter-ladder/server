import express from 'express';
import bodyParser from 'body-parser';
import passport from './passport/index.js';
import * as db from './queries/index.js';
import jwt from 'jsonwebtoken';

const app = express()
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', "Origin, x-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
})
app.use(passport.initialize())

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token === null) return response.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        console.log(response)
        if (error) return response.sendStatus(403)
        request.user = user
        next()
    })
}

// const generateAccessToken = (user) => {
//     return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
// }

app.post('/users/register', db.createUser)
app.post('/users/login', db.loginUser)
app.post('/users/token', db.updateToken)
app.delete('/users/logout', db.logoutUser)

// users
app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

// vocabulary
app.get('/vocabulary', authenticateToken, db.getVocabulary)
app.post('/vocabulary', authenticateToken, db.createVocabulary)

// flashcards
app.get('/vocabulary/count', authenticateToken, db.countVocabulary)
app.post('/flashcards', authenticateToken, db.getFlashcards)
app.post('/flashcards/completed', authenticateToken, db.updateVocabulary)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
})

