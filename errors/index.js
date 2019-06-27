exports.handleCustomErrors = (err, req, res, next) => {
  console.log('Here');
  console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err);
  // SEE PHOTO 26/06/19
  const psqlBadRequestCodes = ['22P02', '42702', '23503'];
  if (psqlBadRequestCodes.includes(err.code)) {
    //res.status(400).send({ msg: err.message || 'Bad Request' });
    res.status(400).send({ msg: 'Bad Request' });
    console.log(err.message, 'SQL Error Handler');
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.sendMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
