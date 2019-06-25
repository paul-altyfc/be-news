const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router.js');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require('./errors/index.js');
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use(handleCustomErrors);
// app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
