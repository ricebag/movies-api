const { Router } = require('express');
const _ = require('lodash');

const { validateBody } = require('../../middleware');
const { films } = require('../../firestore');
const { addFilmSchema } = require('./schemas');

module.exports = () => {
    const router = Router();

    router.get('/:id', async (req, res, next) => {
        try {
            const id = _.get(req, 'params.id')
            const resp = await films.getFilmById(id)
            res.send(resp)
        } catch (err) {
            next(err)
        }
    })

    router.post('/',
        validateBody([addFilmSchema]),
        async (req, res, next) => {
            try {
                const title = _.get(req, 'body.title')
                const description = _.get(req, 'body.description')
                const releaseDate = _.get(req, 'body["release-date"]')

                const resp = await films.updateFilm(title, description, releaseDate, "POST")
                res.send(resp)
            } catch (err) {
                next(err)
            }
        })

    router.put('/',
        validateBody([addFilmSchema]),
        async (req, res, next) => {
            try {
                const title = _.get(req, 'body.title')
                const description = _.get(req, 'body.description')
                const releaseDate = _.get(req, 'body["release-date"]')

                const resp = await films.updateFilm(title, description, releaseDate, "PUT")
                res.send(resp)
            } catch (err) {
                next(err)
            }
        })

    router.delete('/:id', async (req, res, next) => {
        try {
            const id = _.get(req, 'params.id')
            const resp = await films.delFilmById(id)
            res.send(resp)
        } catch (err) {
            next(err)
        }
    })


    return router;
};
