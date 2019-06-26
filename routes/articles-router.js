const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById
} = require('../controllers/articles-controller.js');

console.log('Articles Router');

articlesRouter.route('/').get(sendArticles);

articlesRouter.route('/:article_id').get(sendArticles);

module.exports = articlesRouter;
