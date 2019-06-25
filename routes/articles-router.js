const articlesRouter = require('express').Router();
const { sendArticleById } = require('../controllers/articles-controller.js');

console.log('Articles Router');

articlesRouter.route('/:article_id').get(sendArticleById);

module.exports = articlesRouter;
