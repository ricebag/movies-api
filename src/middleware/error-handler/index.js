const { isError, get } = require('lodash');

const errorHandler = () => (err, req, res, next) => {
  if (isError(err)) {
    const { message } = err;
    const statusCode = get(err, 'output.payload.statusCode', 500);

    // TODO
    // add logging here before go live
    return res.status(statusCode).send({ message });
  }

  return next();
};

module.exports = errorHandler;
