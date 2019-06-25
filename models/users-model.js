const connection = require('../db/connection.js');

const selectUserById = ({ username }) => {
  console.log('In Users Model');
  return connection
    .first('*')
    .from('users')
    .where({ username })
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `User not found with username ${username}`
        });
      } else return user;
    });
};

module.exports = { selectUserById };
