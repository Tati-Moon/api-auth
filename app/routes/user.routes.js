const express = require('express');
const {verifyInputValue} = require('../middleware');
const userController = require('../controllers/user.controller.js');

const userRoutes = () => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       required:
     *         - firstName
     *         - lastName
     *         - username
     *         - password
     *         - phone
     *         - email
     *       properties:
     *         id:
     *           type: int
     *           primaryKey: true
     *           autoIncrement: true
     *         fistName:
     *           type: string
     *         lastName:
     *           type: string
     *         email:
     *           type: string
     *         username:
     *           type: string
     *         password:
     *           type: string
     *         phone:
     *           type: string
     *         loginAttemptsCount:
     *           type: tinyInt
     *           defaultValue: 0
     *         isActive:
     *           type: BOOLEAN
     *           defaultValue: 1
     */
    const router = express.Router();
    /**
     * @swagger
     * /api-auth/user:
     *   post:
     *     summary: Register a new user
     *     tags:
     *       - User
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: The first name of the user
     *               lastName:
     *                 type: string
     *                 description: The last name of the user
     *               email:
     *                 type: string
     *                 format: email
     *                 description: The email address of the user
     *               username:
     *                 type: string
     *                 description: The username of the user
     *               password:
     *                 type: string
     *                 format: password
     *                 description: The password of the user
     *               phone:
     *                 type: string
     *                 description: The phone number of the user
     *     responses:
     *       '200':
     *         description: User registered successfully
     *       '400':
     *         description: Bad request, invalid input or role not existed
     */
    router.post(
        '/',
        [
            verifyInputValue.checkInputUserValue,
            verifyInputValue.checkRolesExisted,
        ],
        userController.userRegistration,
    );
    /**
     * @swagger
     * /api-auth/user:
     *   get:
     *     summary: Get all users with pagination
     *     tags:
     *       - User
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: The page number for pagination
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *         description: The number of items per page
     *       - in: query
     *         name: search
     *         schema:
     *           type: integer
     *         description: Search by name, username, phone, email
     *     responses:
     *       '200':
     *         description: A list of users with pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 users:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       firstName:
     *                         type: string
     *                       lastName:
     *                         type: string
     *                       email:
     *                         type: string
     *                       username:
     *                         type: string
     *                       phone:
     *                         type: string
     *                       loginAttemptsCount:
     *                         type: integer
     *                       isActive:
     *                         type: boolean
     *                 totalPages:
     *                   type: integer
     *                 currentPage:
     *                   type: integer
     *                 totalItems:
     *                   type: integer
     *       '500':
     *         description: Internal server error
     */
    router.get('/', userController.getAllWithPagination);
    /**
     * @swagger
     * /api-auth/user/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags:
     *       - User
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user to retrieve
     *         schema:
     *           type: integer
     *     responses:
     *       '200':
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 firstName:
     *                   type: string
     *                 lastName:
     *                   type: string
     *                 email:
     *                   type: string
     *                 username:
     *                   type: string
     *                 phone:
     *                   type: string
     *                 loginAttemptsCount:
     *                   type: integer
     *                 isActive:
     *                   type: boolean
     *       '404':
     *         description: User not found
     *       '500':
     *         description: Internal server error
     */
    router.get('/:id', userController.getById);
    /**
     * @swagger
     * /api-auth/user/{id}:
     *   put:
     *     summary: Update user by ID
     *     tags:
     *       - User
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user to update
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *               phone:
     *                 type: string
     *               loginAttemptsCount:
     *                 type: integer
     *               isActive:
     *                 type: boolean
     *     responses:
     *       '200':
     *         description: User updated successfully
     *       '400':
     *         description: Bad request, invalid input
     *       '404':
     *         description: User not found
     *       '500':
     *         description: Internal server error
     */
    router.put(
        '/:id',
        [
            verifyInputValue.checkInputUserValueOnUpdate,
            verifyInputValue.checkRolesExisted,
        ],
        userController.update,
    );
    /**
     * @swagger
     * /api-auth/user/{id}:
     *   patch:
     *     summary: Toggle user active status by ID
     *     tags:
     *       - User
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user to toggle active status
     *         schema:
     *           type: integer
     *     responses:
     *       '200':
     *         description: User active status toggled successfully
     *       '400':
     *         description: Bad request, invalid input
     *       '404':
     *         description: User not found
     *       '500':
     *         description: Internal server error
     */
    router.patch('/:id', userController.toggleUserActiveStatus);

    return router;
};

module.exports = userRoutes;
