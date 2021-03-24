module.exports = (sequelize, DataTypes) => {
  const NextOfKin = sequelize.define(
    'NextOfKin',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      prId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Pensioneers',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      bankId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id',
          onDelete: 'SET NULL',
        },
      },
      surname: { type: DataTypes.STRING },
      firstname: { type: DataTypes.STRING },
      othername: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      accountNo: { type: DataTypes.STRING },
      relationship: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  NextOfKin.associate = (models) => {
    models.NextOfKin.belongsTo(models.Pensioneer, {
      foreignKey: 'prId',
      model: 'Pensioneers',
    });
    models.NextOfKin.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      model: 'Banks',
    });
  };

  return NextOfKin;
};
