const topicsRouter = require('express').Router();
const { sendTopics, addTopic } = require('../controllers/topics-controller.js');
const { sendMethodNotAllowed } = require('../errors/index.js');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addTopic)
  .all(sendMethodNotAllowed);

module.exports = topicsRouter;
