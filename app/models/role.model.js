module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        'role',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        },
        {
            createdAt: true,
            updatedAt: true,
        },
    );
};
