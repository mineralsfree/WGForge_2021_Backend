const ExtendableError = require('./ExtandableError')
module.exports = class NotFoundError extends ExtendableError {
  constructor(props) {
    super(props);
    this.status = 404;
  }
}