module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define(
    'Login',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      userType: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Login.associate = (models) => {
    models.Login.hasOne(models.Pensioneer, {
      foreignKey: 'loginId',
      model: 'Pensioneers',
    });

    models.Login.hasOne(models.User, {
      foreignKey: 'loginId',
      model: 'Users',
    });
  };

  return Login;
};
