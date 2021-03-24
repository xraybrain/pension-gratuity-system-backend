module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pensioneers', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      loginId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Logins',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      deptId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Departments',
          key: 'id',
          onDelete: 'SET NULL',
        },
      },
      dsgId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Designations',
          key: 'id',
          onDelete: 'SET NULL',
        },
      },
      classId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'StaffClasses',
          key: 'id',
          onDelete: 'SET NULL',
        },
      },
      structureId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'SalaryStructures',
          key: 'id',
          onDelete: 'SET NULL',
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
      level: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Levels',
          key: 'id',
        },
      },
      grade: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Grades',
          key: 'id',
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
      dateOfEmp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateOfRet: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      accountNo: {
        type: Sequelize.STRING(10),
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
      address: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      pensionCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      gratuityStatus: { type: Sequelize.STRING, defaultValue: 'unpaid' },
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
    return queryInterface.dropTable('Pensioneers');
  },
};
