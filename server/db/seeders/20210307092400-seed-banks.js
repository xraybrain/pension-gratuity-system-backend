module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Banks',
      [
        {
          name: 'Access Bank',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Fidelity Bank',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Microfinance Bank',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Banks', null, {});
  },
};
