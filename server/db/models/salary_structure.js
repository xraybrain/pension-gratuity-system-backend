module.exports = (sequelize, DataTypes) => {
  const SalaryStructure = sequelize.define(
    'SalaryStructure',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
      shortName: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  SalaryStructure.associate = (models) => {
    models.SalaryStructure.hasMany(models.Pensioneer, {
      foreignKey: 'structureId',
      model: 'Pensioneers',
    });

    models.SalaryStructure.hasMany(models.SalaryStructureList, {
      foreignKey: 'structureId',
      model: 'salarystructurelists',
    });
  };

  return SalaryStructure;
};
