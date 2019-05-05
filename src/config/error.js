const httpStatus = require('http-status');

exports.errorHandler = (err, req, res, next) => {
    const response = {
      code: err.status,
      message: err.message || httpStatus[err.status],
      errors: err.errors,
      stack: err.stack,
    };
  
    if (process.env.PORT !== 'development') {
      delete response.stack;
    }
  
    res.status(err.status);
    res.json(response);
    res.end();
};