const { selectUserById } = require('../models/users-model.js');

const sendUserById = (req, res, next) => {
  selectUserById(req.params)
    .then(user => {
      // console.log(user);
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { sendUserById };
