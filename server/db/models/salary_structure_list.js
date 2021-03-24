module.exports = (sequelize, DataTypes) => {
  const SalaryStructureList = sequelize.define(
    'SalaryStructureList',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      structureId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'SalaryStructures',
          key: 'id',
        },
      },
      level: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Levels',
          key: 'id',
        },
      },
      grade: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'grades',
          key: 'id',
        },
      },
      annualSalary: { type: DataTypes.DECIMAL(8, 2) },
    },
    {
      paranoid: true,
    }
  );

  SalaryStructureList.associate = (models) => {
    models.SalaryStructureList.belongsTo(models.SalaryStructure, {
      foreignKey: 'structureId',
      model: 'salarystructures',
    });
    models.SalaryStructureList.belongsTo(models.Level, {
      foreignKey: 'level',
      model: 'levels',
    });
    models.SalaryStructureList.belongsTo(models.Grade, {
      foreignKey: 'grade',
      model: 'grades',
    });
  };

  return SalaryStructureList;
};
