const articlesRouter = require('express').Router();
const {
  sendArticles,
  changeArticle
} = require('../controllers/articles-controller.js');
const { addComment } = require('../controllers/comments-controller.js');

console.log('Articles Router');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:article_id')
  .get(sendArticles)
  .patch(changeArticle);

articlesRouter.route('/:article_id/comments').post(addComment);

module.exports = articlesRouter;
