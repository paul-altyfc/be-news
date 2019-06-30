const { selectTopics, insertTopic } = require('../models/topics-model.js');

const sendTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

const addTopic = (req, res, next) => {
  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  if (numOfKeys != 2) {
    return Promise.reject({
      status: 400,
      msg: `Only slug and description are acceptable input values`
    }).catch(next);
  } else if (
    // check all fields are named correctly if so do the insert
    (reqArr.includes('slug') && reqArr.includes('description')) === true
  ) {
    insertTopic(req.body)
      .then(topic => {
        res.status(201).send({ topic });
      })
      .catch(next);
  } else {
    return Promise.reject({
      status: 400,
      msg: 'The values provided need to be named slug and description'
    }).catch(next);
  }
};

module.exports = { sendTopics, addTopic };
