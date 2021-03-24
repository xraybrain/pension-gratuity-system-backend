module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SalaryStructureLists', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      structureId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'SalaryStructures',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      level: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Levels',
          key: 'id',
          onDelete: 'NO ACTION',
        },
      },
      grade: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Grades',
          key: 'id',
          onDelete: 'NO ACTION',
        },
      },
      annualSalary: {
        type: Sequelize.DECIMAL(12, 2),
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
    return queryInterface.dropTable('SalaryStructureLists');
  },
};
