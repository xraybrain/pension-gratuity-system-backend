module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Designations',
      [
        {
          name: 'Lecturer 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lecturer 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Assistant Lecturer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Messenger',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Designations', null, {});
  },
};
