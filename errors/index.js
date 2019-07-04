exports.handleCustomErrors = (err, req, res, next) => {
  // Handles Errors where the program has set error
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err);
  const errorCodes = {
    '42703': 'Invalid Column specified',
    '22P02': 'Invalid value entered in URL',
    '23503':
      'Attempted to insert or update a field that is not present on the linked primary table',
    '23505': 'Primary key value being entered already exists on the database'
  };
  if (errorCodes[err.code]) {
    if (err.code === '23503') {
      res.status(422).send({ msg: err.detail });
    } else if (err.code === '23505') {
      res.status(422).send({ msg: err.detail });
    } else {
      res.status(400).send({ msg: errorCodes[err.code] || 'Bad Request' });
    }
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
};

exports.sendMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
