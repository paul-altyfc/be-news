const { selectUserById } = require('../models/users-model.js');

const sendUserById = (req, res, next) => {
  // console.log(req.params);
  // res.status(200).send(console.log('users controller'));
  selectUserById(req.params)
    .then(user => {
      res.status(200).send({ user });
      // console.log({ user });
    })
    .catch(next);
};

module.exports = { sendUserById };
