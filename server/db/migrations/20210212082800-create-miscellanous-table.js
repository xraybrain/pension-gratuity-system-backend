module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Miscellanous', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Levels',
          key: 'id',
        },
      },
      classId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'StaffClasses',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      percent: {
        type: Sequelize.INTEGER(3),
        allowNull: true,
      },
      derivedFrom: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      isCalculated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      category: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      genderRestricted: {
        type: Sequelize.STRING(6),
        allowNull: true,
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
    return queryInterface.dropTable('Miscellanous');
  },
};
