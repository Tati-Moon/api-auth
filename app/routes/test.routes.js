const express = require('express');
const testController = require('../controllers/test.controller.js');
const {authJwt} = require('../middleware');

const testRoutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.json({message: 'Test Auth!'});
    });

    router.get('/all', testController.allAccess);

    router.get('/user', [authJwt.verifyToken], testController.userBoard);

    router.get(
        '/mod',
        [authJwt.verifyToken, authJwt.isModerator],
        testController.moderatorBoard,
    );

    router.get(
        '/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        testController.adminBoard,
    );

    return router;
};
module.exports = testRoutes;
