module.exports = (sequelize, DataTypes) => {
  const Emolument = sequelize.define(
    'Emolument',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      prId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Pensioneers',
          key: 'id',
        },
      },
      bankId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id',
        },
      },
      paymentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Payments',
          key: 'id',
        },
      },
      status: { type: DataTypes.STRING },
      consolidated: { type: DataTypes.DECIMAL(8, 2) },
      grossPay: { type: DataTypes.DECIMAL(8, 2) },
      totalDeducted: { type: DataTypes.DECIMAL(8, 2) },
      netPay: { type: DataTypes.DECIMAL(8, 2) },
    },
  );

  Emolument.associate = (models) => {
    models.Emolument.belongsTo(models.Pensioneer, {
      foreignKey: 'prId',
      model: 'Pensioneers',
    });
    models.Emolument.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      model: 'banks',
    });
    models.Emolument.belongsTo(models.Payment, {
      foreignKey: 'paymentId',
      model: 'Payments',
    });
    models.Emolument.hasMany(models.EmolumentMiscellanous, {
      foreignKey: 'emId',
      model: 'Emolumentmiscellous',
    });
  };

  return Emolument;
};
