module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
  });

  Grade.associate = (models) => {
    models.Grade.hasMany(models.Pensioneer, {
      foreignKey: 'grade',
      model: 'Pensioneers',
    });
  };

  return Grade;
};
