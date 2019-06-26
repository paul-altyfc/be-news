const { selectArticles } = require('../models/articles-model.js');

const sendArticles = (req, res, next) => {
  selectArticles(req.params)
    .then(articles => {
      res.status(200).send({ articles });
      //  console.log({ articles });
    })
    .catch(next);
};

module.exports = { sendArticles };
