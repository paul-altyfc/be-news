const connection = require('../db/connection.js');

const insertComment = commentToAdd => {
  return connection
    .insert(commentToAdd)
    .into('comments')
    .returning('*')
    .then(([comment]) => comment);
};

const selectComments = ({ article_id }, { sort_by, order }) => {
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by || 'created_at', order || 'desc')
    .then(comments => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id ${article_id}`
        });
      } else return comments;
    });
};

const deleteCommentById = ({ comment_id }) => {
  return connection
    .delete()
    .from('comments')
    .where({ comment_id })
    .then(delete_count => {
      if (!delete_count) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} not found`
        });
      }
      return true;
    });
};
const updateComment = () => {};

module.exports = {
  insertComment,
  selectComments,
  deleteCommentById,
  updateComment
};
