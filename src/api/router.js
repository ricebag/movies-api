const { Router } = require('express');
const { validateBody } = require('../middleware');
const { films } = require('../firestore');
const _ = require('lodash');

const { addFilmSchema } = require('./schemas');

module.exports = () => {
    const router = Router();

    router.get('/hello', (req, res) => {
        res.send('Hello World!')
    })

    router.post('/film',
        validateBody([addFilmSchema]),
        (req, res) => {
            const title = _.get(req, 'body.title')
            const description = _.get(req, 'body.description')
            const releaseDate = _.get(req, 'body["release-date"]')

            films.addFilm(title, description, releaseDate)

            res.send('film created')
        })

    return router;
};
