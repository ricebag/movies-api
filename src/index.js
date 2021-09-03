const express = require('express');
const apiRouter = require('./api');
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const server = () => {
    try {
        app.use(express.json({ limit: '10mb' }));

        app.use('/', apiRouter());
        app.listen(port, () => {
            console.log(`App started on port ${port}`)
        })
    } catch (e) {
        console.log(e)
        process.exit(1);
    }
}

server()