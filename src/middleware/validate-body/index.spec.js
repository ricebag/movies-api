jest.mock('ajv');
jest.mock('ajv-formats');

const boom = require('@hapi/boom');
const Ajv = require('ajv');
const addFormats = require("ajv-formats")

const validateBody = require('./');

describe('Validate Body', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('It should throw an error if no schema is provided', async () => {
        try {
            await validateBody()
        } catch (e) {
            expect(e).toEqual(boom.internal('No schemas provided'))
        }
    })

    test('It should throw an error if an empty array is provided for the schemas', async () => {
        try {
            await validateBody([])
        } catch (e) {
            expect(Ajv).toHaveBeenCalledWith({ schemas: [] })
            expect(addFormats).toHaveBeenCalled()
            expect(e).toEqual(boom.internal('Empty schemas provided'))
        }
    })

    test('It should throw an error if the req.body is not valid', async () => {
        const validate = jest.fn(() => false)
        const getSchema = jest.fn(() => validate);
        Ajv.mockImplementation(() => ({
            getSchema
        }));

        const req = { body: 'body' };
        const next = jest.fn();

        try {
            await validateBody(['schema'])(req, 'res', next)
        } catch (e) {

            expect(getSchema).toHaveBeenCalled()
            expect(validate).toHaveBeenCalledWith(req.body)
            expect(next).not.toHaveBeenCalled()
            expect(e).toEqual(boom.badRequest('Request body is not valid'))
        }
    })

    test('It should call next if the req.body is valid based on the schema', async () => {
        const validate = jest.fn(() => true)
        const getSchema = jest.fn(() => validate);
        Ajv.mockImplementation(() => ({
            getSchema
        }));

        const req = { body: 'body' };
        const next = jest.fn();

        await validateBody(['schema'])(req, 'res', next)
        expect(getSchema).toHaveBeenCalled()
        expect(validate).toHaveBeenCalledWith(req.body)
        expect(next).toHaveBeenCalled()
    })
})