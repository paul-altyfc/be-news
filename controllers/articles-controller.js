const {
  selectArticles,
  updateArticle
} = require('../models/articles-model.js');

const sendArticles = (req, res, next) => {
  selectArticles(req.params)
    .then(articles => {
      res.status(200).send({ articles });
      //  console.log({ articles });
    })
    .catch(next);
};

const changeArticle = (req, res, next) => {
  // console.log(req.body);
  // console.log(req.params);
  updateArticle(req.body, req.params)
    .then(article => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { sendArticles, changeArticle };
