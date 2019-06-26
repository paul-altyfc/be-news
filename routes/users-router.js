const usersRouter = require('express').Router();
const { sendUserById } = require('../controllers/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/index.js');

// console.log('Users Router');

usersRouter
  .route('/:username')
  .get(sendUserById)
  .all(sendMethodNotAllowed);

module.exports = usersRouter;
