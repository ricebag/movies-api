const { Router } = require('express');
const _ = require('lodash');

const { validateBody } = require('../../middleware');
const { users } = require('../../firestore');
const { addUserSchema } = require('./schemas');

module.exports = () => {
    const router = Router();

    router.get('/:id', async (req, res, next) => {
        try {
            const id = _.get(req, 'params.id')
            const resp = await users.getUserById(id)
            res.send(resp)
        } catch (err) {
            next(err)
        }
    })

    router.post('/',
        validateBody([addUserSchema]),
        async (req, res, next) => {
            try {
                const firstName = _.get(req, 'body.firstName')
                const lastName = _.get(req, 'body.lastName')
                const films = _.get(req, 'body.films')
                const email = _.get(req, 'body.email')

                const resp = await users.updateUser(firstName, lastName, films, email, "POST")
                res.send(resp)
            } catch (err) {
                next(err)
            }
        })

    router.put('/',
        validateBody([addUserSchema]),
        async (req, res, next) => {
            try {
                const firstName = _.get(req, 'body.firstName')
                const lastName = _.get(req, 'body.lastName')
                const films = _.get(req, 'body.films')
                const email = _.get(req, 'body.email')

                const resp = await users.updateUser(firstName, lastName, films, email, "PUT")
                res.send(resp)
            } catch (err) {
                next(err)
            }
        })

    router.delete('/:id', async (req, res, next) => {
        try {
            const id = _.get(req, 'params.id')
            const resp = await users.delUserById(id)
            res.send(resp)
        } catch (err) {
            next(err)
        }
    })


    return router;
};
