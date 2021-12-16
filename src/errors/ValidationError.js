const ExtendableError = require('./ExtandableError')
module.exports = class ValidationError extends ExtendableError {
  constructor(props) {
    super(props);
    this.status = 400;
  }
}