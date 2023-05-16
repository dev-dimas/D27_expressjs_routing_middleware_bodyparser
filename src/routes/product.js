const express = require('express');

const productCtrl = require('../controllers/ProductController');

const app = express.Router();

app.get('/product', productCtrl.getAllProduct);
app.post('/product', productCtrl.postProduct);
app.get('/product/:id', productCtrl.getProduct);
app.put('/product/:id', productCtrl.updateProduct);
app.delete('/product/:id', productCtrl.deleteProduct);

module.exports = app;
