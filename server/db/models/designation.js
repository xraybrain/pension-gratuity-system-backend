module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define(
    'Designation',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Designation.associate = (models) => {
    models.Designation.hasMany(models.Pensioneer, {
      foreignKey: 'dsgId',
      model: 'Pensioneers',
    });
  };
  return Designation;
};
