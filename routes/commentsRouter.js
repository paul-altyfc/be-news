const commentsRouter = require('express').Router();
const {
  changeComment,
  removeComment
} = require('../controllers/comments-controller.js');

console.log('Comments Router');

commentsRouter
  .route('/:comment_id')
  .delete(removeComment)
  .patch(changeComment);

module.exports = commentsRouter;
