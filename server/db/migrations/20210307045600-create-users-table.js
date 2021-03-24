module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      loginId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Logins',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      surname: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      othername: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        defaultValue: '/assets/avatar.png',
      },
      phone: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
