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

module.exports = { insertComment, selectComments };
