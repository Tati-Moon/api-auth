module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        'user',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING(100),
            },
            lastName: {
                type: Sequelize.STRING(100),
            },
            email: {
                type: Sequelize.STRING(100),
            },
            username: {
                type: Sequelize.STRING(100),
            },
            password: {
                type: Sequelize.STRING(255),
            },
            phone: {
                type: Sequelize.STRING(100),
            },
            loginAttemptsCount: {
                type: Sequelize.TINYINT,
                defaultValue: 0,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
            },
        },
        {
            createdAt: true,
            updatedAt: true,
        },
    );
};
