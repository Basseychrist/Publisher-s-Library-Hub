
module.exports = {
  createAppError: (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    err.isOperational = true;
    return err;
  },
  
  createValidationError: (errors) => {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    err.isOperational = true;
    return err;
  },
  
  createNotFoundError: (resource) => {
    const err = new Error(`${resource} not found`);
    err.statusCode = 404;
    err.isOperational = true;
    return err;
  }
};