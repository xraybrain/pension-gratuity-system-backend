module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Emoluments', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      prId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Pensioneers',
          key: 'id',
        },
      },
      bankId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Banks',
          key: 'id',
          onDelete: "SET NULL"
        },
      },
      paymentId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Payments',
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      status: {
        type: Sequelize.STRING(40),
        defaultValue: 'active',
      },
      consolidated: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      grossPay: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      totalDeducted: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      netPay: {
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
    return queryInterface.dropTable('Emoluments');
  },
};
