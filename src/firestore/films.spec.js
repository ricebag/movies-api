const Boom = require('@hapi/boom');
const films = require('./films')

describe('Films Database', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('updateFilm', () => {
        describe('POST request', () => {
            test('It should set the document in the db', async () => {
                const set = jest.fn(() => "Data has been set")
                const get = jest.fn(() => ({ exists: false }));
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const title = 'title'
                const releaseDate = 'releaseDate'
                const description = 'description'

                expect(await films(db).updateFilm(title, description, releaseDate, "POST")).toEqual("Data has been set");
                expect(collection).toHaveBeenCalledWith('films');
                expect(doc).toHaveBeenCalledWith(`title-releaseDate`);
                expect(get).toHaveBeenCalled();
                expect(set).toHaveBeenCalledWith({ title, description, releaseDate });
            })

            test('It should throw an error if no document already exists', async () => {
                const set = jest.fn()
                const get = jest.fn(() => ({ exists: true }));
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const title = 'title'
                const releaseDate = 'releaseDate'
                const description = 'description'

                try {
                    await films(db).updateFilm(title, description, releaseDate, "POST")
                } catch (e) {
                    expect(e).toEqual(Boom.conflict('Document already exists'));
                    expect(collection).toHaveBeenCalledWith('films');
                    expect(doc).toHaveBeenCalledWith(`title-releaseDate`);
                    expect(get).toHaveBeenCalled();
                    expect(set).not.toHaveBeenCalled();
                }
            })
        });

        describe('PUT request', () => {
            test('It should set the document in the db', async () => {
                const set = jest.fn(() => "Data has been set")
                const get = jest.fn();
                const doc = jest.fn(() => ({ get, set }));
                const collection = jest.fn(() => ({ doc }));
                const db = { collection }

                const title = 'title'
                const releaseDate = 'releaseDate'
                const description = 'description'

                expect(await films(db).updateFilm(title, description, releaseDate, "PUT")).toEqual("Data has been set");
                expect(collection).toHaveBeenCalledWith('films');
                expect(doc).toHaveBeenCalledWith(`title-releaseDate`);
                expect(get).not.toHaveBeenCalled();
                expect(set).toHaveBeenCalledWith({ title, description, releaseDate });
            })
        });
    });

    describe('getFilmById', () => {
        test('It should get the document from the db', async () => {
            const data = jest.fn(() => "data");
            const get = jest.fn(() => ({ data, exists: true }));
            const doc = jest.fn(() => ({ get }));
            const collection = jest.fn(() => ({ doc }));
            const db = { collection }

            expect(await films(db).getFilmById('id')).toEqual("data");
            expect(collection).toHaveBeenCalledWith('films');
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
                await films(db).getFilmById('id')
            } catch (e) {
                expect(e).toEqual(Boom.notFound("Document with id id doesn't exist"));
                expect(collection).toHaveBeenCalledWith('films');
                expect(doc).toHaveBeenCalledWith('id');
                expect(get).toHaveBeenCalled();
                expect(data).not.toHaveBeenCalled();
            }
        })
    });

    describe('delFilmById', () => {
        test('It should delete the document from the db', async () => {
            const deleteFn = jest.fn();
            const doc = jest.fn(() => ({ delete: deleteFn }));
            const collection = jest.fn(() => ({ doc }));
            const db = { collection }

            expect(await films(db).delFilmById('id')).toEqual("Document Deleted");
            expect(collection).toHaveBeenCalledWith('films');
            expect(doc).toHaveBeenCalledWith('id');
            expect(deleteFn).toHaveBeenCalled();
        })
    });
})