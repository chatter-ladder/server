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
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
})

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/users/:id', db.getUserById)
app.post('./users', db.createUser)
app.put('./users/:id', db.updateUser)
app.delete('./users/:id', db.deleteUser)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

