const {
  insertComment,
  selectComments,
  deleteCommentById,
  updateComment
} = require('../models/comments-model.js');

const connection = require('../db/connection.js');

const addComment = (req, res, next) => {
  // check correct number of keys are present
  const { username, body } = req.body;
  // assign the article_id to a new object
  const commentToAdd = req.params;
  // add the create the additional fields for insertion into the comments table
  commentToAdd.body = body;
  commentToAdd.author = username;

  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  if (
    numOfKeys != 2 ||
    (!reqArr.includes('username') || !reqArr.includes('body'))
  ) {
    return Promise.reject({
      status: 400,
      msg: `Only username and body area acceptable input values`
    }).catch(next);
  }
  insertComment(commentToAdd)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(req.params, req.query)
    .then(comments => {
      const articlesExist = article_id
        ? checkExists(article_id, 'articles', 'article_id')
        : null;

      return Promise.all([articlesExist, comments]);
    })
    .then(([articlesExist, comments]) => {
      if (articlesExist === false) {
        return Promise.reject({
          status: 404,
          msg: `No article with the id of ${article_id} found`
        }).catch(next);
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

const checkExists = (value, table, column) => {
  return connection
    .select('*')
    .from(table)
    .where(column, value)
    .then(rows => {
      if (rows.length === 0) return false;
      return true;
    });
};

const removeComment = (req, res, next) => {
  deleteCommentById(req.params)
    .then(comment => {
      if (comment >= 1) {
        res.sendStatus(204);
      }
    })
    .catch(next);
};

const changeComment = (req, res, next) => {
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
    updateComment(req.body, req.params)
      .then(commentArr => {
        comment = commentArr[0];
        if (comment === undefined) {
          const { comment_id } = req.params;
          return Promise.reject({
            status: 404,
            msg: `No comments with id ${comment_id} were found`
          }).catch(next);
        } else {
          res.status(200).send({ comment });
        }
      })
      .catch(next);
  }
};

module.exports = {
  addComment,
  sendCommentsByArticleId,
  removeComment,
  changeComment
};
