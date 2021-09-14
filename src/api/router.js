const { Router } = require('express');
const filmsRouter = require('./films');
const userRouter = require('./users');

module.exports = () => {
    const router = Router();

    router.use('/film', filmsRouter());
    router.use('/user', userRouter());

    return router;
};
