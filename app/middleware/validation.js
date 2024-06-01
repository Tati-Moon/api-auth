const db = require('../models');
const Role = db.roles;
const User = db.users;

checkInputUserValue = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username,
        },
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: 'Failed! Username is already in use!',
            });
            return;
        }

        // Phone
        User.findOne({
            where: {
                phone: req.body.phone,
            },
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: 'Failed! Phone is already in use!',
                });
                return;
            }

            // Email
            User.findOne({
                where: {
                    email: req.body.email,
                },
            }).then(user => {
                if (user) {
                    res.status(400).send({
                        message: 'Failed! Email is already in use!',
                    });
                    return;
                }

                next();
            });
        });
    });
};

checkRolesExisted = async (req, res, next) => {
    if (!req.body.roles) {
        return next();
    }

    try {
        const roles = await Role.findAll({
            where: {
                name: req.body.roles,
            },
        });

        const existingRoleNames = roles.map(role => role.name);
        const nonExistingRoles = req.body.roles.filter(
            role => !existingRoleNames.includes(role),
        );

        if (nonExistingRoles.length > 0) {
            return res.status(400).send({
                message: `Failed! Role(s) do(es) not exist: ${nonExistingRoles.join(', ')}`,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const checkRolesNotExisted = async (req, res, next) => {
    if (!req.body.name) {
        return next();
    }

    try {
        const role = await Role.findOne({
            where: {
                name: req.body.name,
            },
        });

        if (role) {
            return res.status(400).send({
                message: `Failed! Role already exists: ${req.body.name}`,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const verifyInputValue = {
    checkInputUserValue: checkInputUserValue,
    checkRolesExisted: checkRolesExisted,
    checkRolesNotExisted: checkRolesNotExisted,
};

module.exports = verifyInputValue;
