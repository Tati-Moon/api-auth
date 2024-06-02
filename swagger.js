const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'This is a REST API application made with Express.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'Tati',
            url: 'https://github.com/Tati-moon',
        },
    },
    servers: [
        {
            url: 'http://localhost:8088',
            description: 'Auth Development Server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./app/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = app => {
    app.use('/api-auth-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
