const { selectArticles } = require('../models/articles-model.js');

const sendArticles = (req, res, next) => {
  // console.log(req.params);
  // res.status(200).send(console.log('users controller'));
  selectArticles(req.params)
    .then(articles => {
      res.status(200).send({ articles });
      //  console.log({ articles });
    })
    .catch(next);
};

const sendArticleById = (req, res, next) => {
  // console.log(req.params, 'in controller');
  /// const { article_id } = req.params;
  selectArticles(req.params)
    .then(article => {
      res.status(200).send({ article });
      //  console.log({ articles });
    })
    .catch(next);
};

module.exports = { sendArticles, sendArticleById };
