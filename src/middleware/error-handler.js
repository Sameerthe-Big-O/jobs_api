const { CustomAPIError } = require('../errors');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server Error something went wrong'
  }

  if (err.name === 'validationError') {
    customError.message = err.mesage;
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    const cost = Object.keys(
      err.keyValue
    )
    customError.message = `Duplicate value entered for ${cost[0]} field, please choose another value`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }


  return res.status(customError.statusCode).json({
    mesage: customError.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : '🧯'
  })
}

module.exports = errorHandlerMiddleware
