const BaseModel = require('../../db/models/index');
exports.Constants = class Constants {
  static DepartmentInclude = [
    {
      model: BaseModel.Designation,
      order: [[{ model: BaseModel.Designation }, 'name', 'ASC']],
    },
  ];

  static PensioneerIncludes = [
    {
      model: BaseModel.Login,
    },
    {
      model: BaseModel.Department,
    },
    {
      model: BaseModel.Designation,
    },
    {
      model: BaseModel.StaffClass,
    },
    {
      model: BaseModel.SalaryStructure,
    },
    {
      model: BaseModel.Bank,
    },
    {
      model: BaseModel.NextOfKin,
    },
  ];

  static EmolumentInclude = [
    {
      model: BaseModel.Staff,
      include: Constants.PensioneerIncludes,
      order: [['surname', 'ASC']],
    },
    {
      model: BaseModel.EmolumentMiscellanous,
      include: [
        {
          model: BaseModel.Miscellanous,
        },
      ],
    },
  ];

  static ComplaintInclude = [
    { model: BaseModel.Pensioneer },
    {
      model: BaseModel.ComplaintChat,
      as: 'ComplaintChat',
      attributes: [
        'id'
        // [
        //   BaseModel.Sequelize.fn(
        //     'count',
        //     BaseModel.Sequelize.col('ComplaintChats.id')
        //   ),
        //   'replies',
        // ],
      ],
    },
  ];

  static ComplaintChatInclude = [
    {
      model: BaseModel.Login,
      include: [{ model: BaseModel.User }, { model: BaseModel.Pensioneer }],
    },
  ];
};
