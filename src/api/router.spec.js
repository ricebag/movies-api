jest.mock('./films', () => jest.fn());
jest.mock('./users', () => jest.fn());
jest.mock('express', () => ({
    Router: jest.fn(() => ({
        use: jest.fn(),
    })),
}));

const router = require('./router');

describe('Api Router', () => {
    let result;
    beforeEach(() => {
        result = router();
    });

    test('should return router object', () => {
        expect(typeof result).toBe('object');
        expect(result.use).toBeDefined();
    });

    test('should call router.use', () => {
        expect(result.use).toHaveBeenCalled();
        expect(result.use.mock.calls[0][0]).toBe('/film');
        expect(result.use.mock.calls[1][0]).toBe('/user');
    });
});
