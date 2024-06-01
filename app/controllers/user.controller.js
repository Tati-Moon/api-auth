const UserService = require('../services/user.service');

exports.userRegistration = async (req, res) => {
    try {
        await UserService.createUser(req.body);
        res.send({message: 'User was registered successfully!'});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

exports.getAllWithPagination = async (req, res) => {
    try {
        const {page, size, search} = req.query;
        const data = await UserService.getAllUsers(page, size, search);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving users.',
        });
    }
};

exports.getById = async (req, res) => {
    const {id} = req.params;
    try {
        const data = await UserService.getUserById(id);
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving User with id=${id}`,
        });
    }
};

exports.update = async (req, res) => {
    const {id} = req.params;

    try {
        const updated = await UserService.updateUser(id, req.body);
        if (updated) {
            res.send({
                message: 'User was updated successfully.',
            });
        } else {
            res.send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty or provided data is the same as the existing data!`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Error updating User with id=${id}`,
        });
    }
};

exports.toggleUserActiveStatus = async (req, res) => {
    const {id} = req.params;

    try {
        const isActive = await UserService.toggleUserActiveStatus(id);
        res.send({
            message: `User was ${isActive ? 'activated' : 'deactivated'} successfully.`,
        });
    } catch (err) {
        res.status(500).send({
            message: `Error updating User with id=${id}`,
        });
    }
};
