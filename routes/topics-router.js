const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topics-controller.js');
const { sendMethodNotAllowed } = require('../errors/index.js');

topicsRouter
  .route('/')
  .get(sendTopics)
  .all(sendMethodNotAllowed);

module.exports = topicsRouter;
