const knex = require('knex');
const dbConfig = require('../knexfile.js');

// console.log(dbConfig);

const connection = knex(dbConfig);

module.exports = connection;
