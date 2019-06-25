const { selectArticles } = require('../models/articles-model.js');

const sendArticles = (req, res, next) => {
  // console.log(req.params);
  // res.status(200).send(console.log('users controller'));
  selectArticles()
    .then(articles => {
      res.status(200).send({ articles });
      //  console.log({ articles });
    })
    .catch(next);
};

module.exports = { sendArticles };
