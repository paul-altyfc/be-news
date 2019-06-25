const { selectTopics } = require('../models/topics-model.js');

const sendTopics = (req, res, next) => {
  // res.status(200).send(console.log('topics controller'));
  selectTopics().then(topics => {
    res.status(200).send({ topics });
    console.log({ topics });
  });
};

module.exports = { sendTopics };
