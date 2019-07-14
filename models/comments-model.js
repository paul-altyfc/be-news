const connection = require('../db/connection.js');

const insertComment = commentToAdd => {
  return connection
    .insert(commentToAdd)
    .into('comments')
    .returning('*')
    .then(([comment]) => comment);
};

const selectComments = ({ article_id }, { sort_by, order, limit = 10, p }) => {
  if (isNaN(limit) || limit === null || limit === '') limit = 10;
  if (isNaN(p) || p === null || p === '') p = 1;
  const offset = (p - 1) * limit;

  return connection
    .select('*')
    .from('comments')
    .where({ article_id })
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit)
    .offset(offset);
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
const updateComment = ({ inc_votes }, { comment_id }) => {
  return connection('comments')
    .increment('votes', inc_votes)
    .where({ 'comments.comment_id': comment_id })
    .returning('*');
};

module.exports = {
  insertComment,
  selectComments,
  deleteCommentById,
  updateComment
};
