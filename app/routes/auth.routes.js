const express = require('express');
const {verifyInputValue} = require('../middleware');
const controller = require('../controllers/auth.controller');

const authRoutes = () => {
    const router = express.Router();

    router.post(
        '/registration',
        [
            verifyInputValue.checkRolesExisted,
            verifyInputValue.checkInputUserValue,
        ],
        controller.registration,
    );

    router.post('/signin', controller.signin);

    return router;
};

module.exports = authRoutes;
