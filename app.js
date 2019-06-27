const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router.js');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  routeNotFound
} = require('./errors/index.js');

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', routeNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
