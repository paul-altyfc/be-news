const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const articlesRouter = require('./articles-router.js');
const commentsRouter = require('./commentsRouter');
const { sendMethodNotAllowed } = require('../errors/index.js');
const {
  displayEndpointsJSON
} = require('../controllers/endpoint-controller.js');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/')
  .all(sendMethodNotAllowed)
  .get(displayEndpointsJSON);

module.exports = apiRouter;
