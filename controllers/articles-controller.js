const { selectArticleById } = require('../models/articles-model.js');

const sendArticleById = (req, res, next) => {
  // console.log(req.params);
  // res.status(200).send(console.log('users controller'));
  selectArticleById(req.params)
    .then(user => {
      res.status(200).send({ article });
      console.log({ article });
    })
    .catch(next);
};

module.exports = { sendArticleById };
