const usersRouter = require('express').Router();
const { sendUserById } = require('../controllers/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/index.js');

usersRouter
  .route('/:username')
  .get(sendUserById)
  .all(sendMethodNotAllowed);

module.exports = usersRouter;
