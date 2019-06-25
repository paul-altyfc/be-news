const articlesRouter = require('express').Router();
const { sendArticles } = require('../controllers/articles-controller.js');

console.log('Articles Router');

articlesRouter.route('/').get(sendArticles);

module.exports = articlesRouter;
