const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router.js');

console.log('In API Router');
apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
