const express = require('express');

const app = express.Router();

app.get('/', (req, res) => {
  res.send({
    message: 'List of available routes.',
    routes: [
      {
        path: '/product',
        methods: [
          { type: 'GET', description: 'Retrieve all product data.' },
          { type: 'POST', description: 'Send new product data.' },
        ],
      },
      {
        path: '/product/:id',
        methods: [
          { type: 'GET', description: 'Retrieve one product data based on the id parameter.' },
          { type: 'PUT', description: 'Update one product data based on the id parameter.' },
          { type: 'DELETE', description: 'Delete one product data based on the id parameter.' },
        ],
      },
      {
        path: '/product/images/:id',
        methods: [{ type: 'GET', description: 'Get all product data.' }],
      },
    ],
  });
});

module.exports = app;
