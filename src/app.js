const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const path = require('path');

const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

// const bodyParserMiddleware = require('./middleware/bodyParserMiddleware');
const homeRoute = require('./routes');
const productRoute = require('./routes/product');

const app = express();
const upload = multer({ dest: path.resolve('tmp') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());

app.use('/', homeRoute);
app.use(productRoute);
app.use('/images', express.static('public/images'));

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
