const connection = require('../db/connection.js');

const selectTopics = () => {
  return connection.select('slug', 'description').from('topics');
};

module.exports = { selectTopics };
