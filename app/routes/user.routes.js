const express = require('express');
const {verifyInputValue} = require('../middleware');
const userController = require('../controllers/user.controller.js');

const userRoutes = () => {
    const router = express.Router();

    router.post(
        '/',
        [
            verifyInputValue.checkInputUserValue,
            verifyInputValue.checkRolesExisted,
        ],
        userController.userRegistration,
    );

    router.get('/', userController.getAllWithPagination);
    router.get('/:id', userController.getById);
    router.put('/:id', userController.update);
    router.patch('/:id', userController.toggleUserActiveStatus);

    return router;
};

module.exports = userRoutes;
