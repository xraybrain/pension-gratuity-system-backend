module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
  });

  Level.associate = (models) => {
    models.Level.hasMany(models.Pensioneer, {
      foreignKey: 'level',
      model: 'Pensioneers',
    });
  };

  return Level;
};
