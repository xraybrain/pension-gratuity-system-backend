module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Formulas', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      YOS: { //  Years Of Service
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      GP: { // Gratuity Percent
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      PP: { // Pension Percent
        type: Sequelize.INTEGER(3),
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
    return queryInterface.dropTable('Formulas');
  },
};
