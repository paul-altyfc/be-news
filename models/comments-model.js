const connection = require('../db/connection.js');

const insertComment = commentToAdd => {
  return connection
    .insert(commentToAdd)
    .into('comments')
    .returning('*')
    .then(([comment]) => comment);
};

const selectComments = ({ article_id }) => {
  return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where({ article_id })
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
