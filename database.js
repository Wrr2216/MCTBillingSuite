const { Sequelize } = require('sequelize');
const config = require('./config');

const { host, user, password, database } = config.database;

const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host
});

module.exports = sequelize;