module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        'user',
        {
            id: {
                type: Sequelize.INT,
                primaryKey: true,
            },
            fistname: {
                type: Sequelize.STRING,
            },
            lastname: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            username: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            loginAttemptsCount: {
                type: Sequelize.TINYINT
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },     
        },

        {
            createdAt: false,
            updatedAt: false,
        },
    );
};
