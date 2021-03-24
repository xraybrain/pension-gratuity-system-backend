module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NextOfKins', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      prId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Pensioneers',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      bankId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'banks',
          key: 'id',
          onDelete: 'SET NULL',
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
      relationship: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      accountNo: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(200),
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
    return queryInterface.dropTable('NextOfKins');
  },
};
