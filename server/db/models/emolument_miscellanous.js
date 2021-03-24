module.exports = (sequelize, DataTypes) => {
  const EmolumentMiscellanous = sequelize.define(
    'EmolumentMiscellanous',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      mixedId: { type: DataTypes.INTEGER },
      miscId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'miscellanous',
          key: 'id',
        },
      },
      paymentId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Payments',
          key: 'id',
        },
      },
      emId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'salaries',
          key: 'id',
        },
      },
      subTotalAmount: { type: DataTypes.DECIMAL(8, 2) },
    },
    {
      paranoid: true,
    }
  );

  EmolumentMiscellanous.associate = (models) => {
    models.EmolumentMiscellanous.belongsTo(models.Miscellanous, {
      foreignKey: 'miscId',
      model: 'Miscellanous',
    });
    models.EmolumentMiscellanous.belongsTo(models.Emolument, {
      foreignKey: 'emId',
      model: 'Emoluments',
    });
    models.EmolumentMiscellanous.belongsTo(models.Payment, {
      foreignKey: 'paymentId',
      model: 'Payments',
    });
  };

  return EmolumentMiscellanous;
};
