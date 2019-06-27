const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  changeArticle
} = require('../controllers/articles-controller.js');
const {
  addComment,
  sendComments
} = require('../controllers/comments-controller.js');

const { sendMethodNotAllowed } = require('../errors/index.js');

// console.log('Articles Router');

articlesRouter
  .route('/')
  .get(sendArticles)
  .all(sendMethodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(sendArticlesById)
  .patch(changeArticle)
  .all(sendMethodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .post(addComment)
  .get(sendComments)
  .all(sendMethodNotAllowed);

module.exports = articlesRouter;
