module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EmolumentMiscellanous', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      mixedId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true,
      },
      miscId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Miscellanous',
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      emId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Emoluments',
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      subTotalAmount: {
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
    return queryInterface.dropTable('EmolumentMiscellanous');
  },
};
