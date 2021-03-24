module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
  });

  return News;
};
