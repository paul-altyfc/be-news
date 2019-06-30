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
  }

  insertUser(req.body)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(next);
};
module.exports = { sendUserById, addUser, sendUsers };
