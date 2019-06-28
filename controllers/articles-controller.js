const {
  selectArticles,
  updateArticle
} = require('../models/articles-model.js');

const connection = require('../db/connection.js');

const sendArticles = (req, res, next) => {
  const { author, topic } = req.query;
  selectArticles(req.params, req.query)
    .then(articles => {
      // console.log(articles);
      const authorExists =
        author !== undefined ? checkExists(author, 'users', 'username') : null;

      const topicExists =
        topic !== undefined ? checkExists(topic, 'articles', 'topic') : null;

      return Promise.all([authorExists, topicExists, articles]);
    })
    .then(([authorExists, topicExists, articles]) => {
      // console.log(authorExists, topicExists, articles);
      if (authorExists === false) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      } else if (topicExists === false) {
        return Promise.reject({ status: 404, msg: 'Topic not found' });
      } else {
        // console.log({});
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
      article = article[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

const changeArticle = (req, res, next) => {
  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  const { inc_votes } = req.body;

  if (numOfKeys > 1) {
    return Promise.reject({
      status: 400,
      msg: `The inc_votes value should be a single item. Multiple items were passed`
    }).catch(next);
  } else if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: `No value passed to update votes`
    }).catch(next);
  } else if (typeof inc_votes === 'string') {
    return Promise.reject({
      status: 400,
      msg: `Unable to update votes with a value of ${inc_votes}`
    }).catch(next);
  } else {
    updateArticle(req.body, req.params)
      .then(article => {
        article = article[0];
        res.status(200).send({ article });
      })
      .catch(next);
  }
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
