const endpointsJSON = require('../endpoints.json');

const displayEndpointsJSON = (req, res, next) => {
  console.log('Here');
  res.status(200).send(endpointsJSON);
};

module.exports = { displayEndpointsJSON };
