module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        'role',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
            }
        },

        {
            createdAt: false,
            updatedAt: false,
        },
    );
};
