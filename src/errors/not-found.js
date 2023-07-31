
const CustomAPIError = require('./custom-api');

class NotFoundError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = NotFoundError;
