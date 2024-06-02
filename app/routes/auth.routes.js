const express = require('express');
const {verifyInputValue} = require('../middleware');
const controller = require('../controllers/auth.controller');

const authRoutes = () => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     Auth:
     *       type: object
     *       required:
     *         - login
     *         - password
     *       properties:
     *         login:
     *           type: string
     *         password:
     *           type: string
     */

    const router = express.Router();

    // Registration user
    /**
     * @swagger
     * /api-auth/auth/registration:
     *   post:
     *     summary: Register a new user (ONLY FOR ADMIN)
     *     tags: [Registration]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstname:
     *                 type: string
     *                 example: Test
     *               lastname:
     *                 type: string
     *                 example: Test
     *               email:
     *                 type: string
     *                 example: Test@test.com
     *               username:
     *                 type: string
     *                 example: Test
     *               password:
     *                 type: string
     *                 example: test
     *               phone:
     *                 type: string
     *                 example: +375 29 123 45 67
     *               roles:
     *                 type: array
     *                 items:
     *                   type: string
     *                 example: ["moderator", "user", "admin"]
     *     responses:
     *       200:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User was registered successfully!
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       500:
     *         description: Some error occurred while registering the user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.post(
        '/registration',
        [
            verifyInputValue.checkRolesExisted,
            verifyInputValue.checkInputUserValue,
        ],
        controller.registration,
    );

    // Signin user
    /**
     * @swagger
     * /api-auth/auth/signin:
     *   post:
     *     summary: Sign in a user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: TestUser
     *               password:
     *                 type: string
     *                 example: password123
     *     responses:
     *       200:
     *         description: User signed in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 username:
     *                   type: string
     *                   example: TestUser
     *                 email:
     *                   type: string
     *                   example: testuser@example.com
     *                 roles:
     *                   type: array
     *                   items:
     *                     type: string
     *                   example: ["ROLE_USER", "ROLE_MODERATOR","ROLE_ADMIN"]
     *                 accessToken:
     *                   type: string
     *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *       400:
     *         description: Invalid username or password
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Invalid username or password
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User Not found
     *       500:
     *         description: Some error occurred while signing in
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: An error occurred while processing your request
     */
    router.post('/signin', controller.signin);

    return router;
};

module.exports = authRoutes;
