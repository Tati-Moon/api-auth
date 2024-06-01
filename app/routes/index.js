const express = require('express');

const testRoutes = require('./test.routes.js');
const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const roleRoutes = require('./role.routes.js');

const apiRouter = () => {
    return express
        .Router()

        .use((req, res, next) => {
            res.header(
                'Access-Control-Allow-Headers',
                'x-access-token, Origin, Content-Type, Accept',
            );
            next();
        })
        .use((req, res, next) => {
            const currentDate = new Date();
            const dateTime = `Time: ${currentDate.getDate()}/${
                currentDate.getMonth() + 1
            }/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
            console.log(dateTime);
            console.log('Request Type:', req.method);
            console.log('Request URL:', req.originalUrl);
            next();
        })

        .use('/auth', authRoutes())
        .use('/user', userRoutes())
        .use('/role', roleRoutes())
        .use('/test', testRoutes());
};
module.exports = apiRouter;
