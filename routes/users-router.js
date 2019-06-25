const usersRouter = require('express').Router();
const { sendUserById } = require('../controllers/users-controller.js');

console.log('Users Router');

usersRouter.route('/:username').get(sendUserById);

module.exports = usersRouter;
