const RoleService = require('../services/role.service');
const {validateRole} = require('../validators/validator');

exports.getAllWithPagination = async (req, res) => {
    try {
        const {page, size, name} = req.query;
        const data = await RoleService.getAllRoles(page, size, name);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving roles.',
        });
    }
};

exports.getById = async (req, res) => {
    const {id} = req.params;
    try {
        const data = await RoleService.getRoleById(id);
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Role with id=${id}.`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving Role with id=${id}`,
        });
    }
};

exports.create = [
    validateRole,
    async (req, res) => {
        try {
            const data = await RoleService.createRole(req.body.name);
            return res.send(data);
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(500).send({
                    message: `Duplicate entry "${req.body.id}" for key`,
                });
            }
            return res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the Role.',
            });
        }
    },
];

exports.update = [
    validateRole,
    async (req, res) => {
        const {id} = req.params;

        try {
            const updated = await RoleService.updateRole(id, req.body);
            if (updated) {
                res.send({
                    message: 'Role was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty or provided data is the same as the existing data!`,
                });
            }
        } catch (err) {
            res.status(500).send({
                message: `Error updating Role with id=${id}`,
            });
        }
    },
];
