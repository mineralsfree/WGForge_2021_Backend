const ExtendableError = require('./ExtandableError')
module.exports = class UnauthorizedError extends ExtendableError {
  constructor(props) {
    super(props);
    this.status = 401
  }
}