const express = require('express');
const testController = require('../controllers/test.controller.js');
const {authJwt} = require('../middleware');

const testRoutes = () => {
    const router = express.Router();
    /**
     * @swagger
     * /api-auth/test:
     *   get:
     *     summary: Get test message
     *     tags: [Test]
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Test message
     */
    router.get('/', (req, res) => {
        res.json({message: 'Test Auth!'});
    });
    /**
     * @swagger
     * /api-auth/test/all:
     *   get:
     *     summary: Access all route
     *     tags: [Test]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Test message for all access route
     */
    router.get('/all', testController.allAccess);
    /**
     * @swagger
     * /api-auth/test/user:
     *   get:
     *     summary: Access user route
     *     tags: [Test]
     *     parameters:
     *       - in: header
     *         name: x-access-token
     *         schema:
     *           type: string
     *         required: true
     *         description: Access token
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Test message for user access route
     *     security:
     *       - bearerAuth: []
     */
    router.get('/user', [authJwt.verifyToken], testController.userBoard);
    /**
     * @swagger
     * /api-auth/test/mod:
     *   get:
     *     summary: Access moderator route
     *     tags: [Test]
     *     parameters:
     *       - in: header
     *         name: x-access-token
     *         schema:
     *           type: string
     *         required: true
     *         description: Access token
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Test message for moderator access route
     *     security:
     *       - bearerAuth: []
     */
    router.get(
        '/mod',
        [authJwt.verifyToken, authJwt.isModerator],
        testController.moderatorBoard,
    );
    /**
     * @swagger
     * /api-auth/test/admin:
     *   get:
     *     summary: Access admin route
     *     tags: [Test]
     *     parameters:
     *       - in: header
     *         name: x-access-token
     *         schema:
     *           type: string
     *         required: true
     *         description: Access token
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Test message for admin access route
     *     security:
     *       - bearerAuth: []
     */
    router.get(
        '/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        testController.adminBoard,
    );

    return router;
};
module.exports = testRoutes;
