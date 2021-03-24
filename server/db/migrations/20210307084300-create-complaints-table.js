module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Complaints', {
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
      content: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      readStatus: {
        type: Sequelize.INTEGER(3),
        defaultValue: 0, // 0 = UnRead, 1 = Read
      },
      status: {
        type: Sequelize.INTEGER(3),
        defaultValue: 0, // 0 = UnResolved, 1 = Resolved
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
    return queryInterface.dropTable('Complaints');
  },
};
