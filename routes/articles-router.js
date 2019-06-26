const articlesRouter = require('express').Router();
const {
  sendArticles,
  changeArticle
} = require('../controllers/articles-controller.js');
const {
  addComment,
  sendComments
} = require('../controllers/comments-controller.js');

console.log('Articles Router');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:article_id')
  .get(sendArticles)
  .patch(changeArticle);

articlesRouter
  .route('/:article_id/comments')
  .post(addComment)
  .get(sendComments);

module.exports = articlesRouter;
