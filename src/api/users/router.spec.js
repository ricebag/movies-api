jest.mock('express', () => ({
    Router: () => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }),
}));
jest.mock('../../firestore', () => ({
    users: {
        getUserById: jest.fn(),
        delUserById: jest.fn(),
        updateUser: jest.fn(),
    }
}))
jest.mock('../../middleware', () => ({ validateBody: jest.fn() }))

const usersRouter = require('./router');
const { users } = require('../../firestore');
const { validateBody } = require('../../middleware');
const { addUserSchema } = require('./schemas');

describe('users router', () => {
    let router, handler, send, next, status;

    describe('GET by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = usersRouter();
            [[, handler]] = router.get.mock.calls;
        });

        describe('when making a valid GET request to /:id', () => {
            test('it should GET the user', async () => {
                users.getUserById.mockImplementationOnce(() => 'resp');
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(users.getUserById).toHaveBeenCalledWith('1234567890');
            });
        });

        describe('when making an invalid GET request to /:id', () => {
            test('it should return an error', async () => {
                const err = new Error();
                users.getUserById.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith('resp');
                expect(users.getUserById).toHaveBeenCalledWith('1234567890');
            });
        });
    });

    describe('DELETE by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = usersRouter();
            [[, handler]] = router.delete.mock.calls;
        });

        describe('when making a valid DELETE request to /:id', () => {
            test('it should DELETE the user', async () => {
                users.delUserById.mockImplementationOnce(() => 'resp');
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(users.delUserById).toHaveBeenCalledWith('1234567890');
            });
        });

        describe('when making an invalid DELETE request to /:id', () => {
            test('it should return an error', async () => {
                const err = new Error();
                users.delUserById.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ params: { id: '1234567890' } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith('resp');
                expect(users.delUserById).toHaveBeenCalledWith('1234567890');
            });
        });
    });

    describe('POST by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = usersRouter();
            [[, , handler]] = router.post.mock.calls;
        });

        const firstName = 'firstName';
        const lastName = 'lastName';
        const films = 'films';
        const email = 'email';

        describe('when making a valid POST request to /', () => {
            test('it should add the user to the db', async () => {
                users.updateUser.mockImplementationOnce(() => 'resp');
                await handler({ body: { firstName, lastName, films, email } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(users.updateUser).toHaveBeenCalledWith(firstName, lastName, films, email, "POST");
                expect(validateBody).toHaveBeenCalledWith([addUserSchema])
            });
        });

        describe('when making an invalid POST request to /', () => {
            test('it should return an error', async () => {
                const err = new Error();
                users.updateUser.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ body: { firstName, lastName, films, email } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith();
                expect(users.updateUser).toHaveBeenCalledWith(firstName, lastName, films, email, "POST");
                expect(validateBody).toHaveBeenCalledWith([addUserSchema])
            });
        });

    });

    describe('PUT by Id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            send = jest.fn();
            next = jest.fn();
            router = usersRouter();
            [[, , handler]] = router.put.mock.calls;
        });

        const firstName = 'firstName';
        const lastName = 'lastName';
        const films = 'films';
        const email = 'email';

        describe('when making a valid PUT request to /', () => {
            test('it should update the user in the db', async () => {
                users.updateUser.mockImplementationOnce(() => 'resp');
                await handler({ body: { firstName, lastName, films, email } }, { send }, next);
                expect(send).toHaveBeenCalledWith('resp');
                expect(users.updateUser).toHaveBeenCalledWith(firstName, lastName, films, email, "PUT");
                expect(validateBody).toHaveBeenCalledWith([addUserSchema])
            });
        });

        describe('when making an invalid PUT request to /', () => {
            test('it should return an error', async () => {
                const err = new Error();
                users.updateUser.mockImplementationOnce(() => {
                    throw err;
                });
                await handler({ body: { firstName, lastName, films, email } }, { send }, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(send).not.toHaveBeenCalledWith();
                expect(users.updateUser).toHaveBeenCalledWith(firstName, lastName, films, email, "PUT");
                expect(validateBody).toHaveBeenCalledWith([addUserSchema])
            });
        });

    });
});