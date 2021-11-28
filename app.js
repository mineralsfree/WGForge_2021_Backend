require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const PORT = process.env.PORT || 3000;

const errorHandler = require('./src/errorHandler');


mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const swaggerOptions = {
  swaggerDefinition: {},
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// use JWT auth to secure the api
app.use(jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}).unless({
  path:['/api/products', '/api/user/auth', '/api/user/register']
}));

// api routes
app.use('/api/', require('./src/routes/routes'));

// global error handler
app.use(errorHandler);

// start server
const server = app.listen(PORT, function () {
  // console.log(bcrypt.hashSync('qwerty', 10));
  console.log('Server listening on port ' + PORT);
});
