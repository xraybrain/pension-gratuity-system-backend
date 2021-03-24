module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      type:  { type: DataTypes.INTEGER }
    },
    {
      paranoid: true,
    }
  );

  Payment.associate = (models) => {
    models.Payment.hasMany(models.Emolument, {
      foreignKey: 'paymentId',
      model: 'staffs',
    });
  };

  return Payment;
};
