module.exports = (sequelize, DataTypes) => {
  const Pensioneer = sequelize.define(
    'Pensioneer',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      loginId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Logins',
          key: 'id',
        },
      },
      deptId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Departments',
          key: 'id',
        },
      },
      dsgId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Designations',
          key: 'id',
        },
      },
      classId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'StaffClasses',
          key: 'id',
        },
      },
      structureId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'SalaryStructures',
          key: 'id',
          onDelete: 'SET NULL',
        },
      },
      bankId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Banks',
          key: 'id',
        },
      },
      surname: { type: DataTypes.STRING },
      firstname: { type: DataTypes.STRING },
      othername: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      dateOfEmp: { type: DataTypes.DATE }, // date of employment
      dateOfRet: { type: DataTypes.DATE }, // date of retirement
      accountNo: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
      pensionCount: { type: DataTypes.INTEGER},
      gratuityStatus: {type: DataTypes.STRING}
    },
    {
      paranoid: true,
    }
  );

  Pensioneer.associate = (models) => {
    models.Pensioneer.belongsTo(models.Login, {
      foreignKey: 'loginId',
      model: 'logins',
    });
    models.Pensioneer.belongsTo(models.Department, {
      foreignKey: 'deptId',
      model: 'departments',
    });
    models.Pensioneer.belongsTo(models.Designation, {
      foreignKey: 'dsgId',
      model: 'designations',
    });
    models.Pensioneer.belongsTo(models.StaffClass, {
      foreignKey: 'classId',
      model: 'staffclasses',
    });
    models.Pensioneer.belongsTo(models.SalaryStructure, {
      foreignKey: 'structureId',
      model: 'salarystructures',
    });
    models.Pensioneer.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      model: 'banks',
    });
    models.Pensioneer.hasOne(models.NextOfKin, {
      foreignKey: 'prId',
      model: 'NextOfKins',
    });
  };

  return Pensioneer;
};
