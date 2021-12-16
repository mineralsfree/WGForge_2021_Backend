const ExtendableError = require("./ExtandableError");
const {UnauthorizedError} = require("express-jwt");
function errorHandler(err, req, res, next) {
  if (err instanceof ExtendableError){
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof UnauthorizedError){
    return res.status(err.status).json({message: err.message});
  }
  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
module.exports = errorHandler;
