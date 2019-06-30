const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  changeArticle,
  removeArticle,
  addArticle
} = require('../controllers/articles-controller.js');
const {
  addComment,
  sendCommentsByArticleId
} = require('../controllers/comments-controller.js');

const { sendMethodNotAllowed } = require('../errors/index.js');

articlesRouter
  .route('/')
  .get(sendArticles)
  .post(addArticle)
  .all(sendMethodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(sendArticlesById)
  .patch(changeArticle)
  .delete(removeArticle)
  .all(sendMethodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .post(addComment)
  .get(sendCommentsByArticleId)
  .all(sendMethodNotAllowed);

module.exports = articlesRouter;
