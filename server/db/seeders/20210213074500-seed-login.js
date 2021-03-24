const { encryptPassword } = require('../../lib/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'logins',
      [
        {
          email: 'admin@gmail.com',
          password: encryptPassword('admin'),
          userType: "superadmin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'admin1@gmail.com',
          password: encryptPassword('admin1'),
          userType: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Logins', null, {});
  },
};
