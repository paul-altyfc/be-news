const connection = require('../db/connection.js');

const selectArticleById = ({ article_id }) => {
  console.log('In Articles Model');
  console.log(article_id);
  // NEED TO DEBUG FROM HERE
  return connection
    .first('*')
    .from('articles')
    .where({ article_id })
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `User not found with username ${article_id}`
        });
      } else return article;
    });
};

module.exports = { selectArticleById };
