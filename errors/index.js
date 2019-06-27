exports.handleCustomErrors = (err, req, res, next) => {
  // Handles Errors where the program has set error values
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err.code);
  // console.log(err.message);
  const errorCodes = {
    '42703': 'Invalid Column specified',
    '22P02': 'Invalid value entered in URL',
    '23503':
      'Attempted to insert or update a field that is not present on the linked primary table'
  };
  if (errorCodes[err.code]) {
    res.status(400).send({ msg: errorCodes[err.code] || 'Bad Request' });
    console.log(err.message);
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
