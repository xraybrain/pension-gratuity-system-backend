module.exports = {
  up: (queryInterface, Sequelize) => {
    let levels = [];
    for (let i = 1; i <= 15; i++) {
      levels.push({
        id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('Levels', levels, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Levels', null, {});
  },
};
