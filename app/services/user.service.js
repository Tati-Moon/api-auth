const bcrypt = require('bcryptjs');
const db = require('../models');
const {getPagination, getPagingData} = require('./utils');

const User = db.users;
const {Op} = db.Sequelize;

const saltValue = 8;

const normalizePhone = phone => phone.replace(/[\s-()]/g, '');

const createUser = async userData => {
    const newUserData = userData;
    newUserData.phone = normalizePhone(newUserData.phone);
    newUserData.password = bcrypt.hashSync(newUserData.password, saltValue);
    const user = await User.create(newUserData);
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
    const normalizedPhone = normalizePhone(phone);
    return User.findOne({
        where: {
            phone: normalizedPhone,
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
    const convertedNewData = newData;
    if (convertedNewData.password) {
        convertedNewData.password = bcrypt.hashSync(
            convertedNewData.password,
            saltValue,
        );
    }
    convertedNewData.phone = normalizePhone(convertedNewData.phone);
    const [updated] = await User.update(convertedNewData, {where: {id}});
    return updated;
};

const getAllUsers = async (page, size, search) => {
    const condition = search
        ? {
              [Op.or]: [
                  {username: {[Op.like]: `%${search}%`}},
                  {firstName: {[Op.like]: `%${search}%`}},
                  {lastName: {[Op.like]: `%${search}%`}},
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
