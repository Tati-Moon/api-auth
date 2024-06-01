const UserService = require('../services/user.service');
const RoleService = require('../services/role.service');

const checkInputUserValue = async (req, res, next) => {
    try {
        const {username, phone, email} = req.body;

        // Check Username
        if (username) {
            const userByUsername =
                await UserService.getUserByUsername(username);
            if (userByUsername) {
                return res
                    .status(400)
                    .send({message: 'Failed! Username is already in use!'});
            }
        }

        // Check Phone
        if (phone) {
            const userByPhone = await UserService.getUserByPhone(phone);
            if (userByPhone) {
                return res
                    .status(400)
                    .send({message: 'Failed! Phone is already in use!'});
            }
        }

        // Check Email
        if (email) {
            const userByEmail = await UserService.getUserByEmail(email);
            if (userByEmail) {
                return res
                    .status(400)
                    .send({message: 'Failed! Email is already in use!'});
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

const checkInputUserValueOnUpdate = async (req, res, next) => {
    const {id} = req.params;
    const {username, phone, email} = req.body;

    try {
        // Find the current user by id
        const currentUser = await UserService.getUserById(id);
        if (!currentUser) {
            return res
                .status(404)
                .send({message: `User not found with id=${id}`});
        }

        // Check if username is already in use by another user
        if (username && username !== currentUser.username) {
            const userWithSameUsername =
                await UserService.getUserByUsernameExcludingId(username, id);
            if (userWithSameUsername) {
                return res.status(400).send({
                    message: 'Failed! Username is already in use!',
                });
            }
        }

        // Check if phone is already in use by another user
        if (phone && phone !== currentUser.phone) {
            const userWithSamePhone =
                await UserService.getUserByPhoneExcludingId(phone, id);
            if (userWithSamePhone) {
                return res.status(400).send({
                    message: 'Failed! Phone is already in use!',
                });
            }
        }

        // Check if email is already in use by another user
        if (email && email !== currentUser.email) {
            const userWithSameEmail =
                await UserService.getUserByEmailExcludingId(email, id);
            if (userWithSameEmail) {
                return res.status(400).send({
                    message: 'Failed! Email is already in use!',
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

const checkRolesExisted = async (req, res, next) => {
    if (!req.body.roles) {
        return next();
    }

    try {
        const roles = await RoleService.getRolesByName(req.body.roles);
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
        const exists = await RoleService.checkRoleExists(req.body.name);
        if (exists) {
            return res.status(400).send({
                message: `Failed! Role already exists: ${req.body.name}`,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const checkRoleNameOnUpdate = async (req, res, next) => {
    const {id} = req.params;
    const {name: newName} = req.body;

    if (!newName) {
        return next();
    }

    try {
        // Find the current role by id
        const currentRole = await RoleService.getRoleById(id);
        if (!currentRole) {
            return res
                .status(404)
                .send({message: `Role not found with id=${id}`});
        }

        // If the new name is the same as the current name, no need to check further
        if (currentRole.name === newName) {
            return next();
        }

        // Check if the new name already exists
        const existingRole = await RoleService.getRoleByName(newName);
        if (existingRole) {
            return res.status(400).send({
                message: `Failed! Role name already exists: ${newName}`,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const verifyInputValue = {
    checkInputUserValue,
    checkInputUserValueOnUpdate,
    checkRolesExisted,
    checkRolesNotExisted,
    checkRoleNameOnUpdate,
};

module.exports = verifyInputValue;
