const connection = require('../db/connection.js');

const selectTopics = () => {
  return connection.select('slug', 'description').from('topics');
};

const insertTopic = topicToAdd => {
  return connection
    .insert(topicToAdd)
    .into('topics')
    .returning('*')
    .then(([topic]) => topic);
};

module.exports = { selectTopics, insertTopic };
