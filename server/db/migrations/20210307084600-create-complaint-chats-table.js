module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ComplaintChats', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      complaintId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Complaints',
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      loginId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'logins',
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      reply: {
        type: Sequelize.STRING(300),
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
    return queryInterface.dropTable('ComplaintChats');
  },
};
