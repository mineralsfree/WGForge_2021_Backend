const ExtendableError = require('./ExtandableError')
module.exports = class UnprocessableError extends ExtendableError{
  constructor(props) {
    super(props);
    this.status = 422;
  }
}