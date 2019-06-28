const commentsRouter = require('express').Router();
const {
  changeComment,
  removeComment
} = require('../controllers/comments-controller.js');

const { sendMethodNotAllowed } = require('../errors/index.js');

commentsRouter
  .route('/:comment_id')
  .delete(removeComment)
  .patch(changeComment)
  .all(sendMethodNotAllowed);

module.exports = commentsRouter;
