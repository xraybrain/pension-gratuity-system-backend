module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Department.associate = (models) => {
    models.Department.hasMany(models.Pensioneer, {
      foreignKey: 'deptId',
      model: 'Pensioneers',
    });
  };

  return Department;
};
