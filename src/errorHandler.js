const errorTypes = require('./const/errorTypes')
function errorHandler(err, req, res, next) {
  if (typeof (err) === 'string') {
    return res.status(400).json({ message: err });
  }

  if (err.name === errorTypes.VALIDATION_ERROR) {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }
  if (err.name === errorTypes.NOT_FOUND){
    return res.status(404).json({message: err.message})
  }
  if (err.name === errorTypes.FORBIDDEN){
    return res.status(403).json({ message: 'Access Forbidden' });

  }
  if (err.name === errorTypes.UNAUTHORIZED_ERROR) {
    // jwt authentication error
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
module.exports = errorHandler;
