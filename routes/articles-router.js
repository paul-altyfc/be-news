const articlesRouter = require('express').Router();
const {
  sendArticles,
  changeArticle
} = require('../controllers/articles-controller.js');

console.log('Articles Router');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:article_id')
  .get(sendArticles)
  .patch(changeArticle);

module.exports = articlesRouter;
