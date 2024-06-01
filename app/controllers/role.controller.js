const db = require('../models');
const Role = db.roles;
const {Op} = db.Sequelize;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return {limit, offset};
};

const getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: roles} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        roles,
        totalPages,
        currentPage,
    };
};

// Retrieve all Roles from the database.
exports.getAllWithPagination = (req, res) => {
    const {page, size, name} = req.query;
    const condition = name ? {name: {[Op.like]: `%${name}%`}} : null;

    const {limit, offset} = getPagination(page, size);

    Role.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving roles.',
            });
        });
};

// Find a single Role with an id
exports.getById = (req, res) => {
    const {id} = req.params;

    Role.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Role with id=${id}.`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving Role with id=${id}`,
            });
        });
};

// Create and Save a new Role
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: 'Role name can not be empty!',
        });

        return;
    }

    // Create a Role
    const role = {
        name: req.body.name,
    };

    // Save Role in the database
    Role.create(role)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(500).send({
                    message: `Duplicate entry "${req.body.id}" for key`,
                });
                return;
            }
            res.status(500).send({
                message:
                    err.message + JSON.stringify(role) ||
                    'Some error occurred while creating the Role.',
            });
        });
};

// Update a Role by the id in the request
exports.update = (req, res) => {
    const {id} = req.params;

    Role.update(req.body, {
        where: {id: id},
    })
        .then(num => {
            if (+num === 1) {
                res.send({
                    message: 'Role was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty or provided data is the same as the existing data!`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error updating Role with id=${id}`,
            });
        });
};
