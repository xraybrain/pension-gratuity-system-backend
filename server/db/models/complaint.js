module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define('Complaint', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    prId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Pensioneers',
        key: 'id',
      },
    },
    content: { type: DataTypes.STRING },
    readStatus: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
  });

  Complaint.associate = (models) => {
    models.Complaint.belongsTo(models.Pensioneer, {
      foreignKey: 'prId',
      model: 'Pensioneer',
    });
    models.Complaint.hasMany(models.ComplaintChat, {
      foreignKey: 'complaintId',
      model: 'ComplaintChats',
      as: 'ComplaintChat'
    });
  };

  return Complaint;
};
