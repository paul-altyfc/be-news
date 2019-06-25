const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const articlesRouter = require('./articles-router.js');

console.log('In API Router');
apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
