module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Departments',
      [
        {
          name: 'Computer Science',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Nutrition and Dietics',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Food Science',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Office Technology Management',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Departments', null, {});
  },
};
