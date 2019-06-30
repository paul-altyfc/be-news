const {
  selectUserById,
  insertUser,
  selectUsers
} = require('../models/users-model.js');

const sendUserById = (req, res, next) => {
  selectUserById(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const sendUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const addUser = (req, res, next) => {
  const reqArr = Object.keys(req.body);
  const numOfKeys = reqArr.length;
  if (numOfKeys != 3) {
    return Promise.reject({
      status: 400,
      msg: `You need to provide values for username, avatar_url and name`
    }).catch(next);
  } else if (
    // check all fields are named correctly if so do the insert
    (reqArr.includes('username') &&
      reqArr.includes('avatar_url') &&
      reqArr.includes('name')) === true
  ) {
    insertUser(req.body)
      .then(user => {
        res.status(201).send({ user });
      })
      .catch(next);
  } else {
    return Promise.reject({
      status: 400,
      msg: 'The values provided need to be named username, avatar_url and name'
    }).catch(next);
  }
};
module.exports = { sendUserById, addUser, sendUsers };
