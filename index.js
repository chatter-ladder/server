import express from 'express';
import bodyParser from 'body-parser';
import * as db from './queries.js';

const app = express()
const port = 3001;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', "Origin, x-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
})

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

// users
app.post('/users/register', db.createUser)
app.post('/users/login', db.loginUser)
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/users/:id', db.getUserById)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

// vocabulary
app.get('/users/:id/vocabulary', db.getVocabulary)
app.post('/vocabulary', db.createVocabulary)

// flashcards
app.get('/users/:id/vocabulary/count', db.countVocabulary)
app.post('/flashcards', db.getFlashcards)
app.post('/flashcards/completed', db.updateVocabulary)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

