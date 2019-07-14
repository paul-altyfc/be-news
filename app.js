const express = require('express');
// Added 14/7/19 to handle cors error message
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api-router.js');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  routeNotFound
} = require('./errors/index.js');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', routeNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
