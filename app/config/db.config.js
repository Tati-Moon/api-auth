const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind('../../');
dotenv.config({path: root('.env.local')});

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.USER_DB,
    PASSWORD: process.env.PASSWORD_DB,
    DB: process.env.NAME_DB,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
