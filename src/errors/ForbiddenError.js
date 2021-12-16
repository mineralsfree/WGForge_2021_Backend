const ExtendableError = require('./ExtandableError')
module.exports = class ForbiddenError extends ExtendableError {
  constructor(props) {
    super(props);
    this.status = 403;
  }
};