module.exports = (sequelize, DataTypes) => {
  const Miscellanous = sequelize.define(
    'Miscellanous',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      level: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'levels',
          key: 'id',
        },
      },
      classId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'staffclasses',
          key: 'id',
        },
      },
      title: { type: DataTypes.STRING },
      percent: { type: DataTypes.INTEGER },
      derivedFrom: { type: DataTypes.STRING },
      isCalculated: { type: DataTypes.BOOLEAN },
      amount: { type: DataTypes.DECIMAL(8, 2) },
      category: { type: DataTypes.INTEGER },
      genderRestricted: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Miscellanous.associate = (models) => {
    models.Miscellanous.belongsTo(models.Level, {
      foreignKey: 'level',
      model: 'levels',
    });
    models.Miscellanous.belongsTo(models.StaffClass, {
      foreignKey: 'classId',
      model: 'staffclasses',
    });
    models.Miscellanous.hasMany(models.EmolumentMiscellanous, {
      foreignKey: 'miscId',
      model: 'emolumentmiscellous',
    });
  };

  return Miscellanous;
};
