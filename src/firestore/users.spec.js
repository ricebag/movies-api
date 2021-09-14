const Boom = require('@hapi/boom');
const users = require('./users')

describe('Users Database', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('updateUser', () => {
        describe('POST request', () => {
            test('It should set the document in the db', async () => {
                const set = jest.fn(() => "Data has been set")
                const get = jest.fn(() => ({ exists: false }));
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const firstName = 'firstName';
                const lastName = 'lastName';
                const films = 'films';
                const email = 'email';

                expect(await users(db).updateUser(firstName, lastName, films, email, "POST")).toEqual("Data has been set");
                expect(collection).toHaveBeenCalledWith('users');
                expect(doc).toHaveBeenCalledWith(email);
                expect(get).toHaveBeenCalled();
                expect(set).toHaveBeenCalledWith({
                    email,
                    films,
                    firstName,
                    lastName,
                });
            })

            test('It should throw an error if no document already exists', async () => {
                const set = jest.fn()
                const get = jest.fn(() => ({ exists: true }));
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const firstName = 'firstName';
                const lastName = 'lastName';
                const films = 'films';
                const email = 'email';

                try {
                    await users(db).updateUser(firstName, lastName, films, email, "POST")
                } catch (e) {
                    expect(e).toEqual(Boom.conflict('Document already exists'));
                    expect(collection).toHaveBeenCalledWith('users');
                    expect(doc).toHaveBeenCalledWith(email);
                    expect(get).toHaveBeenCalled();
                    expect(set).not.toHaveBeenCalled();
                }
            })
        });

        describe('PUT request', () => {
            test('It should set the document in the db', async () => {
                const set = jest.fn(() => "Data has been set")
                const get = jest.fn(() => ({ exists: false }));
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const firstName = 'firstName';
                const lastName = 'lastName';
                const films = 'films';
                const email = 'email';

                expect(await users(db).updateUser(firstName, lastName, films, email, "PUT")).toEqual("Data has been set");
                expect(collection).toHaveBeenCalledWith('users');
                expect(doc).toHaveBeenCalledWith(email);
                expect(get).not.toHaveBeenCalled();
                expect(set).toHaveBeenCalledWith({
                    email,
                    films,
                    firstName,
                    lastName,
                });
            })
        });
    });

    describe('getUserById', () => {
        test('It should get the document from the db', async () => {
            const data = jest.fn(() => "data");
            const get = jest.fn(() => ({ data, exists: true }));
            const doc = jest.fn(() => ({ get }));
            const collection = jest.fn(() => ({ doc }));
            const db = { collection }

            expect(await users(db).getUserById('id')).toEqual("data");
            expect(collection).toHaveBeenCalledWith('users');
            expect(doc).toHaveBeenCalledWith('id');
            expect(get).toHaveBeenCalled();
            expect(data).toHaveBeenCalled();
        })

        test('It should throw an error if no document is found', async () => {
            const data = jest.fn(() => "data");
            const get = jest.fn(() => ({ data, exists: false }));
            const doc = jest.fn(() => ({ get }));
            const collection = jest.fn(() => ({ doc }));
            const db = { collection }

            try {
                await users(db).getUserById('id')
            } catch (e) {
                expect(e).toEqual(Boom.notFound("Document with id id doesn't exist"));
                expect(collection).toHaveBeenCalledWith('users');
                expect(doc).toHaveBeenCalledWith('id');
                expect(get).toHaveBeenCalled();
                expect(data).not.toHaveBeenCalled();
            }
        })
    });

    describe('delUserById', () => {
        test('It should delete the document from the db', async () => {
            const deleteFn = jest.fn();
            const doc = jest.fn(() => ({ delete: deleteFn }));
            const collection = jest.fn(() => ({ doc }));
            const db = { collection }

            expect(await users(db).delUserById('id')).toEqual("User Successfully Deleted");
            expect(collection).toHaveBeenCalledWith('users');
            expect(doc).toHaveBeenCalledWith('id');
            expect(deleteFn).toHaveBeenCalled();
        })
    });
})