module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'StaffClasses',
      [
        {
          name: 'Academic',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Non Academic',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Contract',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StaffClasses', null, {});
  },
};
