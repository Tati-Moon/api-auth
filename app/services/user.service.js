const db = require('../models');
const User = db.users;
const bcrypt = require('bcryptjs');
const {Op} = db.Sequelize;

const createUser = async userData => {
    userData.password = bcrypt.hashSync(userData.password, 8);
    const user = await User.create(userData);
    await user.setRoles([1]); // Assign default role
    return user;
};

const getUserByUsername = async username => {
    return User.findOne({where: {username}});
};

const getUserByPhone = async phone => {
    return User.findOne({where: {phone}});
};

const getUserByEmail = async email => {
    return User.findOne({where: {email}});
};

const getUserById = async id => {
    return User.findByPk(id);
};

const getUserByUsernameExcludingId = async (username, id) => {
    return User.findOne({
        where: {
            username,
            id: {[Op.ne]: id},
        },
    });
};

const getUserByPhoneExcludingId = async (phone, id) => {
    return User.findOne({
        where: {
            phone,
            id: {[Op.ne]: id},
        },
    });
};

const getUserByEmailExcludingId = async (email, id) => {
    return User.findOne({
        where: {
            email,
            id: {[Op.ne]: id},
        },
    });
};

const updateUser = async (id, newData) => {
    if (newData.password) {
        newData.password = bcrypt.hashSync(newData.password, 8);
    }
    const [updated] = await User.update(newData, {where: {id}});
    return updated;
};

const getAllUsers = async (page, size, search) => {
    const condition = search
        ? {
              [Op.or]: [
                  {username: {[Op.like]: `%${search}%`}},
                  {firstname: {[Op.like]: `%${search}%`}},
                  {lastname: {[Op.like]: `%${search}%`}},
                  {phone: {[Op.like]: `%${search}%`}},
                  {email: {[Op.like]: `%${search}%`}},
              ],
          }
        : null;

    const {limit, offset} = getPagination(page, size);

    const data = await User.findAndCountAll({where: condition, limit, offset});
    return getPagingData(data, page, limit);
};

const toggleUserActiveStatus = async id => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error(`Cannot find User with id=${id}.`);
    }

    user.isActive = !user.isActive;
    await user.save();
    return user.isActive;
};

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

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    toggleUserActiveStatus,
    getUserById,
    getUserByUsername,
    getUserByPhone,
    getUserByEmail,
    getUserByUsernameExcludingId,
    getUserByPhoneExcludingId,
    getUserByEmailExcludingId,
};
