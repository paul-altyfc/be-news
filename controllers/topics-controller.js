const { selectTopics, insertTopic } = require('../models/topics-model.js');

const sendTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

const addTopic = (req, res, next) => {
  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  if (
    numOfKeys != 2 ||
    !reqArr.includes('slug') ||
    !reqArr.includes('description')
  ) {
    return Promise.reject({
      status: 400,
      msg: `Only slug and description are acceptable input values`
    }).catch(next);
  }
  insertTopic(req.body)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

module.exports = { sendTopics, addTopic };
