const db = require('../models');
const User = db.users;
const {Op} = db.Sequelize;

var bcrypt = require('bcryptjs');

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

exports.userRegistration = (req, res) => {
    // Save User to Database

    User.create({
        fistname: req.body.fistname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
    })
        .then(user => {
            user.setRoles([1]).then(() => {
                res.send({message: 'User was registered successfully!'});
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

// Retrieve all Users from the database.
exports.getAllWithPagination = (req, res) => {
    const {page, size, search} = req.query;
    const condition = search
        ? {
              [Op.or]: [
                  {username: {[Op.like]: `%${search}%`}},
                  {fistname: {[Op.like]: `%${search}%`}},
                  {lastname: {[Op.like]: `%${search}%`}},
                  {phone: {[Op.like]: `%${search}%`}},
                  {email: {[Op.like]: `%${search}%`}},
              ],
          }
        : null;

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

// Find a single User with an id
exports.getById = (req, res) => {
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
    const {id} = req.params;

    req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.update(req.body, {
        where: {id: id},
    })
        .then(num => {
            if (+num === 1) {
                res.send({
                    message: 'User was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty or provided data is the same as the existing data!`,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error updating User with id=${id}`,
            });
        });
};

// Deactivation/activation a User by the id in the request
exports.toggleUserActiveStatus = (req, res) => {
    const {id} = req.params;

    User.findByPk(id)
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`,
                });
                return;
            }

            // Toggle the isActive field
            user.isActive = !user.isActive;

            user.save()
                .then(() => {
                    res.send({
                        message: `User was ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: `Error updating User with id=${id}`,
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving User with id=${id}`,
            });
        });
};
