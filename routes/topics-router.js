const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topics-controller.js');

console.log('Topics Router');

topicsRouter.route('/').get(sendTopics);

module.exports = topicsRouter;

//.get(console.log('Topics Router'));
