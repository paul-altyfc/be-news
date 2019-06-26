const {
  insertComment,
  selectComments
} = require('../models/comments-model.js');

const addComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const commentToAdd = req.params;
  commentToAdd.body = body;
  commentToAdd.author = username;

  // console.log(commentToAdd, 'data to be added');

  insertComment(commentToAdd)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const sendComments = (req, res, next) => {
  // console.log(req.query);
  selectComments(req.params, req.query)
    .then(comments => {
      console.log(comments);
      res.status(200).send({ comments });
    })
    .catch(console.log);
};

module.exports = { addComment, sendComments };