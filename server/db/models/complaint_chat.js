module.exports = (sequelize, DataTypes) => {
  const ComplaintChat = sequelize.define('ComplaintChat', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    complaintId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Complaints',
        key: 'id',
      },
    },
    loginId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Logins',
        key: 'id',
      },
    },
    reply: { type: DataTypes.STRING },
  });

  ComplaintChat.associate = (models) => {
    models.ComplaintChat.belongsTo(models.Complaint, {
      foreignKey: 'complaintId',
      model: 'Complaints',
    });

    models.ComplaintChat.belongsTo(models.Login, {
      foreignKey: 'loginId',
      model: 'Logins',
    });
  };

  return ComplaintChat;
};
