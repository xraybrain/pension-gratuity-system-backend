module.exports = (sequelize, DataTypes) => {
  const Formula = sequelize.define('Formula', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    YOS: { type: DataTypes.INTEGER }, // Years Of Service
    GP: { type: DataTypes.INTEGER }, // Gratuity Percent
    PP: { type: DataTypes.INTEGER }, // Pension Percent
  });

  return Formula;
};
