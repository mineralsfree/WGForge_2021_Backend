require('dotenv').config()
const mongoose = require('mongoose')

async function connect() {
  await mongoose.connect(process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI);
  return mongoose.connection;
}

module.exports = connect;