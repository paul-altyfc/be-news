const {
  selectArticles,
  updateArticle
} = require('../models/articles-model.js');

const sendArticles = (req, res, next) => {
  selectArticles(req.params, req.query)
    .then(articles => {
      res.status(200).send({ articles });
      console.log({ articles });
    })
    .catch(next);
};

const changeArticle = (req, res, next) => {
  updateArticle(req.body, req.params)
    .then(article => {
      res.status(200).send({ article });
      // console.log({ article });
    })
    .catch(next);
};

module.exports = { sendArticles, changeArticle };
