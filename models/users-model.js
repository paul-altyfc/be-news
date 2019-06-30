const connection = require('../db/connection.js');

const selectUserById = ({ username }) => {
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

const selectUsers = () => {
  return connection.select('*').from('users');
};

const insertUser = userToAdd => {
  return connection
    .insert(userToAdd)
    .into('users')
    .returning('*')
    .then(([user]) => user);
};

module.exports = { selectUserById, insertUser, selectUsers };
