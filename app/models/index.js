const {Sequelize} = require('sequelize');
const config = require('../config/db.config.js');
const users = require('./user.model.js');
const roles = require('./role.model.js');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    // https://stackoverflow.com/questions/58593200/deprecationwarning-a-boolean-value-was-passed-to-options-operatorsaliases-this
    operatorsAliases: 0,

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
});

const db = {
    Sequelize,
    sequelize,

    users: users(sequelize, Sequelize),
    roles: roles(sequelize, Sequelize),
};

db.roles.belongsToMany(db.users, {
    through: 'user_roles',
});
db.users.belongsToMany(db.roles, {
    through: 'user_roles',
});

module.exports = db;
