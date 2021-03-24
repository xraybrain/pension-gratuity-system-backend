module.exports = (sequelize, DataTypes) => {
  const StaffClass = sequelize.define('StaffClass', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
  });

  StaffClass.associate = (models) => {
    models.StaffClass.hasMany(models.Pensioneer, {
      foreignKey: 'classId',
      model: 'Pensioneers',
    });
  };

  return StaffClass;
};
