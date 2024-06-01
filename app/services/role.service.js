const db = require('../models');
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

module.exports = {
    checkRoleExists,
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    getRoleByName,
    getRolesByName,
};
