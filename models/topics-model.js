const connection = require('../db/connection.js');

const selectTopics = () => {
  // console.log('In Topics Model');
  return connection.select('slug', 'description').from('topics');
};

module.exports = { selectTopics };
