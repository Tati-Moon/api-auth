const db = require('../models');
const config = require('../config/auth.config');
const User = db.users;
const Role = db.roles;
const Op = db.Sequelize.Op;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.registration = (req, res) => {
    // Save User to Database

    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles,
                        },
                    },
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({
                            message: 'User was registered successfully!',
                        });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({message: 'User was registered successfully!'});
                });
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: 'User Not found.'});
            }

            if (!user.isActive) {
                return res.status(403).send({
                    message: 'Access denied, account is deactivated.',
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password,
            );

            if (!passwordIsValid) {
                user.loginAttemptsCount = (user.loginAttemptsCount || 0) + 1;

                if (user.loginAttemptsCount > 5) {
                    return user
                        .save()
                        .then(() => {
                            res.status(401).send({
                                message:
                                    'Exceeded maximum number of login attempts. Please reset your password.',
                            });
                        })
                        .catch(err => {
                            res.status(500).send({message: err.message});
                        });
                }

                return user
                    .save()
                    .then(() => {
                        res.status(401).send({
                            accessToken: null,
                            message: 'Invalid Password!',
                            loginAttemptsCount: user.loginAttemptsCount,
                        });
                    })
                    .catch(err => {
                        res.status(500).send({message: err.message});
                    });
            }

            user.loginAttemptsCount = 0;
            user.save()
                .then(() => {
                    const token = jwt.sign({id: user.id}, config.secret, {
                        algorithm: 'HS256',
                        allowInsecureKeySizes: true,
                        expiresIn: 86400, // 24 hours
                    });

                    var authorities = [];
                    user.getRoles().then(roles => {
                        for (let i = 0; i < roles.length; i++) {
                            authorities.push(
                                'ROLE_' + roles[i].name.toUpperCase(),
                            );
                        }
                        res.status(200).send({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            accessToken: token,
                        });
                    });
                })
                .catch(err => {
                    res.status(500).send({message: err.message});
                });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};
