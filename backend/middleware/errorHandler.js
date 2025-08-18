module.exports = (err, req, res, next) => {
  // Default error structure
  const error = {
    success: false,
    error: {
      type: err.name || 'ServerError',
      message: err.message || 'Internal server error',
      details: err.details || [],
      statusCode: err.statusCode || 500
    }
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.error.type = 'ValidationError';
    error.error.statusCode = 400;
    error.error.details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  // Handle pg duplicate key error
  
  // Handle invalid ObjectId
  if (err.kind === 'ObjectId') {
    error.error.type = 'InvalidIdError';
    error.error.statusCode = 400;
    error.error.message = 'Invalid resource ID format';
  }
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
    error.error.stack = err.stack;
  }
  
  res.status(error.error.statusCode).json(error);
};