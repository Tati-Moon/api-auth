const db = require('../models');
const config = require('../config/auth.config');
const RoleService = require('../services/role.service');
const UserService = require('../services/user.service');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.registration = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        if (req.body.roles) {
            const roles = await RoleService.getRolesByName(req.body.roles);
            await user.setRoles(roles);
        }
        res.send({message: 'User was registered successfully!'});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await UserService.getUserByUsername(req.body.username);
        if (!user) {
            return res.status(404).send({message: 'User Not found.'});
        }

        if (!user.isActive) {
            return res.status(403).send({
                message: 'Access denied, account is deactivated.',
            });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password,
        );

        if (!passwordIsValid) {
            user.loginAttemptsCount = (user.loginAttemptsCount || 0) + 1;

            if (user.loginAttemptsCount > 5) {
                await user.save();
                return res.status(401).send({
                    message:
                        'Exceeded maximum number of login attempts. Please reset your password.',
                });
            }

            await user.save();
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!',
                loginAttemptsCount: user.loginAttemptsCount,
            });
        }

        user.loginAttemptsCount = 0;
        await user.save();
        const token = jwt.sign({id: user.id}, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

        const roles = await user.getRoles();
        const authorities = roles.map(
            role => 'ROLE_' + role.name.toUpperCase(),
        );

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};
