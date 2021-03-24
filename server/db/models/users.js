module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      loginId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'logins',
          key: 'id',
        },
      },
      surname: { type: DataTypes.STRING },
      firstname: { type: DataTypes.STRING },
      othername: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  User.associate = (models) => {
    models.User.belongsTo(models.Login, {
      foreignKey: 'loginId',
      model: 'logins',
    });
  };

  return User;
};
