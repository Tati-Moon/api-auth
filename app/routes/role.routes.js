const express = require('express');
const {verifyInputValue} = require('../middleware');
const roleController = require('../controllers/role.controller.js');

const roleRoutes = () => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     Role:
     *       type: object
     *       required:
     *         - name
     *       properties:
     *         id:
     *           type: int
     *           primaryKey: true
     *           autoIncrement: true
     *         name:
     *           type: string
     *         createdAt:
     *           type: datetime
     *         updatedAt:
     *           type: datetime
     */
    const router = express.Router();
    /**
     * @swagger
     * /api-auth/role:
     *   get:
     *     summary: Get all roles with pagination
     *     tags:
     *       - Roles
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
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter roles by name
     *     responses:
     *       '200':
     *         description: A list of roles with pagination
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 roles:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       name:
     *                         type: string
     *                       createdAt:
     *                         type: string
     *                         format: date-time
     *                       updatedAt:
     *                         type: string
     *                         format: date-time
     *                 totalPages:
     *                   type: integer
     *                 currentPage:
     *                   type: integer
     *       '500':
     *         description: Internal server error
     */
    router.get('/', roleController.getAllWithPagination);
    /**
     * @swagger
     * /api-auth/role/{id}:
     *   get:
     *     summary: Get role by ID
     *     tags:
     *       - Roles
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the role to get
     *         schema:
     *           type: integer
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   description: The unique identifier of the role
     *                 name:
     *                   type: string
     *                   description: The name of the role
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the role was created
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the role was last updated
     *       '404':
     *         description: Role not found
     */
    router.get('/:id', roleController.getById);
    /**
     * @swagger
     * /api-auth/role:
     *   post:
     *     summary: Create a new role
     *     tags:
     *       - Roles
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The name of the role
     *     responses:
     *       '201':
     *         description: Role created successfully
     *       '400':
     *         description: Bad request, role with the same name already exists
     */
    router.post(
        '/',
        [verifyInputValue.checkRolesNotExisted],
        roleController.create,
    );
    /**
     * @swagger
     * /api-auth/role/{id}:
     *   put:
     *     summary: Update a role by ID
     *     tags:
     *       - Roles
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the role to update
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The new name of the role
     *     responses:
     *       '200':
     *         description: Role updated successfully
     *       '400':
     *         description: Bad request, role name already exists or invalid input
     *       '404':
     *         description: Role not found
     */
    router.put(
        '/:id',
        [verifyInputValue.checkRoleNameOnUpdate],
        roleController.update,
    );

    return router;
};

module.exports = roleRoutes;
