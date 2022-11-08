const { default: knex } = require('knex');
const knexfile = require('./knexfile')[process.env.NODE_ENV || 'development'];

const db = knex(knexfile);

if (db) console.log(`Connected to DB -> ${process.env.DB_NAME.toUpperCase()}`);

module.exports = db;
