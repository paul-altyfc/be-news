const {
  selectArticles,
  updateArticle
} = require('../models/articles-model.js');

const connection = require('../db/connection.js');

const sendArticles = (req, res, next) => {
  const { author, topic } = req.query;
  selectArticles(req.params, req.query)
    .then(articles => {
      const authorExists = author
        ? checkExists(author, 'users', 'username')
        : null;

      return Promise.all([authorExists, articles]);
    })
    .then(([authorExists, articles]) => {
      // console.log(authorExists, articles);
      if (authorExists === false) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};
const sendArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(req.params, req.query)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No articles with id ${article_id} were found`
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const changeArticle = (req, res, next) => {
  updateArticle(req.body, req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const checkExists = (value, table, column) => {
  return connection
    .select('*')
    .from(table)
    .where(column, value)
    .then(rows => {
      return rows.length !== 0;
    });
};

module.exports = { sendArticles, changeArticle, sendArticlesById };
