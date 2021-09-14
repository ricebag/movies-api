const errorHandler = require('./');

describe('Error Handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('It should return the status code and message of any errors', async () => {
        const err = new Error('uh oh');
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const res = {
            status,
            send,
        };
        const next = jest.fn()

        await errorHandler()(err, 'req', res, next)
        expect(status).toHaveBeenCalledWith(500)
        expect(send).toHaveBeenCalledWith({ message: 'uh oh' })
    })

    test('It should handle non errors by calling next()', async () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const res = {
            status,
            send,
        };
        const next = jest.fn()

        await errorHandler()('err', 'req', res, next)
        expect(status).not.toHaveBeenCalled()
        expect(send).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })
})