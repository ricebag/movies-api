jest.mock('express', () => ({
    Router: () => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }),
}));
jest.mock('../../firestore', () => ({
    films: {
        getFilmById: jest.fn(),
        delFilmById: jest.fn(),
        updateFilm: jest.fn(),
    }
}))
jest.mock('../../middleware', () => ({ validateBody: jest.fn() }))

const filmsRouter = require('./router');
const { films } = require('../../firestore');
const { validateBody } = require('../../middleware');
const { addFilmSchema } = require('./schemas');

describe('films router', () => {
    let router, handler, send, next, status;

    describe('GET by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = filmsRouter();
            [[, handler]] = router.get.mock.calls;
        });

        describe('when making a valid GET request to /:id', () => {
            test('it should GET an array of items', async () => {
                films.getFilmById.mockImplementationOnce(() => 'resp');
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
            });
        });

        describe('when making an invalid GET request to /:id', () => {
            test('it should return a input error', async () => {
                const err = new Error();
                err.statusCode = 403;
                films.getFilmById.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
            });
        });
    });

    describe('DELETE by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = filmsRouter();
            [[, handler]] = router.delete.mock.calls;
        });

        describe('when making a valid DELETE request to /:id', () => {
            test('it should DELETE the film', async () => {
                films.delFilmById.mockImplementationOnce(() => 'resp');
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(films.delFilmById).toHaveBeenCalledWith('1234567890');
            });
        });

        describe('when making an invalid DELETE request to /:id', () => {
            test('it should return an error', async () => {
                const err = new Error();
                films.delFilmById.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith('resp');
                expect(films.delFilmById).toHaveBeenCalledWith('1234567890');
            });
        });
    });

    describe('POST by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = filmsRouter();
            [[, , handler]] = router.post.mock.calls;
        });

        const title = 'title';
        const description = 'description';
        const releaseDate = 'releaseDate';

        describe('when making a valid POST request to /', () => {
            test('it should add the film to the db', async () => {
                films.updateFilm.mockImplementationOnce(() => 'resp');
                await handler({ body: { title, description, "release-date": releaseDate } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(films.updateFilm).toHaveBeenCalledWith(title, description, releaseDate, "POST");
                expect(validateBody).toHaveBeenCalledWith([addFilmSchema])
            });
        });

        describe('when making an invalid POST request to /', () => {
            test('it should return an error', async () => {
                const err = new Error();
                films.updateFilm.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ body: { title, description, "release-date": releaseDate } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith();
                expect(films.updateFilm).toHaveBeenCalledWith(title, description, releaseDate, "POST");
                expect(validateBody).toHaveBeenCalledWith([addFilmSchema])
            });
        });

    });

    describe('PUT by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = filmsRouter();
            [[, , handler]] = router.put.mock.calls;
        });

        const title = 'title';
        const description = 'description';
        const releaseDate = 'releaseDate';

        describe('when making a valid PUT request to /', () => {
            test('it should update the film in the db', async () => {
                films.updateFilm.mockImplementationOnce(() => 'resp');
                await handler({ body: { title, description, "release-date": releaseDate } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(films.updateFilm).toHaveBeenCalledWith(title, description, releaseDate, "PUT");
                expect(validateBody).toHaveBeenCalledWith([addFilmSchema])
            });
        });

        describe('when making an invalid PUT request to /', () => {
            test('it should return an error', async () => {
                const err = new Error();
                films.updateFilm.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ body: { title, description, "release-date": releaseDate } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith();
                expect(films.updateFilm).toHaveBeenCalledWith(title, description, releaseDate, "PUT");
                expect(validateBody).toHaveBeenCalledWith([addFilmSchema])
            });
        });
    });
});