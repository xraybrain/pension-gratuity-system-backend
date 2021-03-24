module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
  });

  Bank.associate = (models) => {
    models.Bank.hasMany(models.Pensioneer, {
      foreignKey: 'bankId',
      model: 'Pensioneers',
    });
  };

  return Bank;
};
