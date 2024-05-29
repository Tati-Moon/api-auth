const db = require('../models');

const User = db.users;
const {Op} = db.Sequelize;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return {limit, offset};
};

const getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: users} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        users,
        totalPages,
        currentPage,
    };
};

/*
// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.id) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
        return;
    }

    // Create a User
    const user = {
        id: req.body.id,
        fistname: req.body.fistname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
        loginAttemptsCount: req.body.loginAttemptsCount,
        isActive: req.body.isActive
    };

    // Save User in the database
    User.create(user)
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
                    err.message ||
                    'Some error occurred while creating the User.',
            });
        });
};
*/


// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const {page, size, title} = req.query;
    const condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

    const {limit, offset} = getPagination(page, size);

    User.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving users.',
            });
        });
};

// Retrieve random page.
exports.findRandomPage = (req, res) => {
    const {size, title, timeout} = req.query;
    const parsedTimeout = parseInt(timeout, 10);
    const performQuery = () => {
        const min = 1;
        const max = 5;
        const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log('🚀 ~ file: page.js:12 ~ getData ~ randomInt:', randomInt);
        const page = randomInt - 1;

        const condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

        const {limit, offset} = getPagination(page, size);

        User.findAndCountAll({where: condition, limit, offset})
            .then(data => {
                const response = getPagingData(data, page, limit);
                res.send(response);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message ||
                        'Some error occurred while retrieving users.',
                });
            });
    };

    if (timeout && !Number.isNaN(parsedTimeout)) {
        console.log('timeout:', parsedTimeout);
        setTimeout(() => {
            console.log('timeout finish');
            performQuery();
        }, parsedTimeout);
    } else {
        performQuery();
    }
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const {id} = req.params;

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving User with id=${id}`,
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const {user_id} = req.params;

    User.update(req.body, {
        where: {id: user_id},
    })
        .then(num => {
            if (+num === 1) {
                res.send({
                    message: 'User was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${user_id}. Maybe User was not found or req.body is empty or provided data is the same as the existing data!`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error updating User with id=${user_id}`,
            });
        });
};

// Deactivation/activation a User by the id in the request
exports.toggleActivation  = (req, res) => {
    const {user_id} = req.params;

    const updatedData = {
        ...req.body,
        isActive: !isActive
    };

    User.update(updatedData, {
        where: {id: user_id},
    })
        .then(num => {
            if (+num === 1) {
                res.send({
                    message: 'User was deactivation successfully.',
                });
            } else {
                res.send({
                    message: `Cannot deactivation User with id=${user_id}. Maybe User was not found or req.body is empty or provided data is the same as the existing data!`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error deactivation User with id=${user_id}`,
            });
        });
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };