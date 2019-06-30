const usersRouter = require('express').Router();
const {
  sendUserById,
  addUser,
  sendUsers
} = require('../controllers/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/index.js');

usersRouter
  .route('/:username')
  .get(sendUserById)
  .all(sendMethodNotAllowed);

usersRouter
  .route('/')
  .post(addUser)
  .get(sendUsers);

module.exports = usersRouter;
