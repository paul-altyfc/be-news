const {
  selectArticles,
  updateArticle,
  deleteArticleById,
  insertArticle
} = require('../models/articles-model.js');

const connection = require('../db/connection.js');

const addArticle = (req, res, next) => {
  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  if (numOfKeys !== 4) {
    return Promise.reject({
      status: 400,
      msg: 'You need to provide values for title, body, topic and author'
    }).catch(next);
  } else if (
    // check all fields are named correctly if so do the insert
    (reqArr.includes('title') &&
      reqArr.includes('body') &&
      reqArr.includes('topic') &&
      reqArr.includes('author')) === true
  ) {
    insertArticle(req.body)
      .then(article => {
        res.status(201).send({ article });
      })
      .catch(next);
  } else {
    return Promise.reject({
      status: 400,
      msg: 'The values provided need to be named title, body, topic and author'
    }).catch(next);
  }
};

// const sendArticles = (req, res, next) => {
//   const { author, topic } = req.query;
//   selectArticles(req.params, req.query)
//     .then(articles => {
//       const authorExists =
//         author !== undefined ? checkExists(author, 'users', 'username') : null;

//       const topicExists =
//         topic !== undefined ? checkExists(topic, 'articles', 'topic') : null;

//       const totalCount = selectTableCount();

//       return Promise.all([authorExists, topicExists, articles, totalCount]);
//     })
//     .then(([authorExists, topicExists, articles, totalCount]) => {
//       // console.log([authorExists, topicExists, articles, totalCount], 'in then');
//       if (authorExists === false) {
//         return Promise.reject({ status: 404, msg: 'Author not found' });
//       } else if (topicExists === false) {
//         return Promise.reject({ status: 404, msg: 'Topic not found' });
//       } else {
//         const articlesObj = {};

//         articlesObj.articles = articles;
//         retObj = Object.assign(articlesObj, totalCount[0]);
//         console.log(retObj);
//         res.status(200).send({ retObj });
//       }
//     })
//     .catch(console.log);
// };

const sendArticles = (req, res, next) => {
  const { author, topic } = req.query;
  selectArticles(req.params, req.query)
    .then(articles => {
      const authorExists =
        author !== undefined ? checkExists(author, 'users', 'username') : null;

      const topicExists =
        topic !== undefined ? checkExists(topic, 'articles', 'topic') : null;

      const totalCount = selectTableCount();

      return Promise.all([authorExists, topicExists, articles, totalCount]);
    })
    .then(([authorExists, topicExists, articles, totalCount]) => {
      // console.log([authorExists, topicExists, articles, totalCount], 'in then');
      if (authorExists === false) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      } else if (topicExists === false) {
        return Promise.reject({ status: 404, msg: 'Topic not found' });
      } else {
        res.status(200).send({
          articles,
          total_count: parseInt(totalCount[0].total_count, 10)
        });
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

const removeArticle = (req, res, next) => {
  deleteArticleById(req.params)
    .then(article => {
      if (article >= 1) {
        res.sendStatus(204);
      }
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

const selectTableCount = () => {
  return connection.select(
    connection.raw('count(*) as total_count FROM articles')
  );
  // .modify(queryBuilder => {
  //   if (column) {
  //     queryBuilder.where({ column, value });
  //   }
  // });

  // connection
  //   //.select('*')
  //   .count(`articles.article_id as total_count`)
  //   .from('articles')
  //   // .modify(queryBuilder => {
  //   //   if (column) {
  //   //     queryBuilder.where({ column, value });
  //   //   }
  //   // })
  //   .groupBy('articles.articles_id')
  //   .then(total_count => {
  //     console.log(total_count, 'in select');
  //     return total_count;
  //  })
  //  .catch(console.log)
  //);
};
module.exports = {
  sendArticles,
  changeArticle,
  sendArticlesById,
  removeArticle,
  addArticle
};
