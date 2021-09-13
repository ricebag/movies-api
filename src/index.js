const express = require('express');
const apiRouter = require('./api');
const { errorHandler } = require('./middleware');

const port = 3000

const server = () => {
    try {
        const app = express();

        app.use(express.json({ limit: '10mb' }));

        app.use('/api', apiRouter());

        app.use(errorHandler())

        app.listen(port, () => {
            console.log(`App started on port ${port}`)
        })

        return app
    } catch (e) {
        console.log(e)

        process.exit(1);
    }
}

server()