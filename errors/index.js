exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  console.log(err);
  const psqlBadRequestCodes = ['22P02', '42702'];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send(err.error);
    // res.status(400).send({ msg: err.message || 'Bad Request' });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
