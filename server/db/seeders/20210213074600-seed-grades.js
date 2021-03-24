module.exports = {
  up: (queryInterface, Sequelize) => {
    let grades = [];
    for (let i = 1; i <= 15; i++) {
      grades.push({
        id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('Grades', grades, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Grades', null, {});
  },
};
