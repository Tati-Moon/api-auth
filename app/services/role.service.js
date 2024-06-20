const db = require('../models');
const {getPagination, getPagingData} = require('./utils');

const Role = db.roles;
const {Op} = db.Sequelize;

const checkRoleExists = async name => {
    const role = await Role.findOne({
        where: {name},
    });
    return !!role;
};

const getAllRoles = async (page, size, name) => {
    const condition = name ? {name: {[Op.like]: `%${name}%`}} : null;
    const {limit, offset} = getPagination(page, size);

    const data = await Role.findAndCountAll({where: condition, limit, offset});
    return getPagingData(data, page, limit);
};

const getRoleByName = async name => {
    return Role.findOne({where: {name}});
};

const getRolesByName = async roleNames => {
    return Role.findAll({where: {name: roleNames}});
};

const getRoleById = async id => {
    return Role.findByPk(id);
};

const createRole = async name => {
    return Role.create({name});
};

const updateRole = async (id, newData) => {
    const [updated] = await Role.update(newData, {
        where: {id},
    });
    return updated;
};

module.exports = {
    checkRoleExists,
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    getRoleByName,
    getRolesByName,
};
