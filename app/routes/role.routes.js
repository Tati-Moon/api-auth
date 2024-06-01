const express = require('express');
const {verifyInputValue} = require('../middleware');
const roleController = require('../controllers/role.controller.js');

const roleRoutes = () => {
    const router = express.Router();

    router.get('/', roleController.getAllWithPagination);
    router.get('/:id', roleController.getById);
    router.post(
        '/',
        [verifyInputValue.checkRolesNotExisted],
        roleController.create,
    );

    router.put(
        '/:id',
        [verifyInputValue.checkRoleNameOnUpdate],
        roleController.update,
    );

    return router;
};

module.exports = roleRoutes;
