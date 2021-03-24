const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const { createData, updateData, deleteData } = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { GetAuthUser } = require('../lib/AuthManager');
const { Constants } = require('../lib/models/Constants');
const { calculateSalary } = require('../lib/salary.helper');
const { createEmolument } = require('../lib/models/Emolument');
const { createPensioneer } = require('../lib/models/Pensioneer');
const { PaymentType } = require('../lib/models/PaymentType');
const { calculateEmolument } = require('../lib/emolument.helper');
const MaxPensions = 40; // 5 years
const Model = 'Emolument';

exports.getEmoluments = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 20;
  let {
    searchquery,
    fromDate,
    toDate,
    pid,
    orderby,
    singleuser,
    authorization,
  } = req.query;
  let orderBy = [];
  let PensioneerOrderBy = [];
  let authUser = GetAuthUser(authorization);
  orderby = orderby || '';

  try {
    let filter = {};
    let PensioneerFilter = {};
    if (searchquery) {
      PensioneerFilter[Op.or] = [
        {
          surname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          firstname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          othername: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        [Op.gte]: fromDate,
        [Op.lte]: toDate,
      };
    }

    if (pid && pid !== 'undefined') filter.paymentId = pid;

    // pensioneer id
    if (authUser && singleuser === 'true') {
      let loginId = authUser.login;
      let pensioneer = await BaseModel.Pensioneer.findOne({
        where: { loginId },
      });
      if (pensioneer) {
        filter.prId = pensioneer.id;
      }
      console.log(pensioneer);
    }

    switch (orderby.toLowerCase()) {
      case 'bank':
        PensioneerOrderBy.push(['bankId', 'ASC']);
        break;
      default:
        orderBy.push(['surname', 'DESC']);
        break;
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [
        {
          model: BaseModel.Pensioneer,
          include: Constants.PensioneerIncludes,
          where: PensioneerFilter,
        },
        {
          model: BaseModel.EmolumentMiscellanous,
          include: [
            {
              model: BaseModel.Miscellanous,
            },
          ],
        },
        {
          model: BaseModel.Payment,
        },
      ],
      [['bankId', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.calculateEmolument = async (req, res, next) => {
  const transaction = await BaseModel.sequelize.transaction();
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback = new Feedback({}, false, null);
  if (authUser) {
    try {
      let paymentId = formData.paymentId;
      let payment = await BaseModel.Payment.findByPk(paymentId);
      let pensioneerChanged = [];

      feedback = await updateData(
        'Payment',
        { status: 'calculated' },
        { id: paymentId },
        null,
        transaction
      );
      let paymentType;
      if (payment) {
        paymentType = payment.type;
      }
      let prIds = [];
      let miscellanous = await BaseModel.Miscellanous.findAll({});
      //TODO: based on payment type only return pensioneers whose gratuitystatus is unpaid (Gratuity calculation)
      let pensioneers = [];
      if (paymentType === PaymentType.Gratuity) {
        pensioneers = await BaseModel.Pensioneer.findAll({
          where: {
            gratuityStatus: 'unpaid',
          },
        });
      } else {
        pensioneers = await BaseModel.Pensioneer.findAll({
          where: {
            pensionCount: {
              [BaseModel.Sequelize.Op.lte]: MaxPensions,
            },
          },
        });
      }

      // calculate emolument of each pensioneer of insert into db
      for (let pensioneer of pensioneers) {
        let calculated = await calculateEmolument(
          pensioneer,
          miscellanous,
          paymentId,
          paymentType
        );
        let emolumentData = calculated.emolument;
        let emolumentMisc = calculated.emolumentMisc;

        // check if pensioneer emolument has been calculated previously
        let alreadyCalculated = await BaseModel.Emolument.findOne(
          {
            where: { prId: pensioneer.id, paymentId: paymentId },
          },
          { transaction }
        );

        if (alreadyCalculated) {
          //-- recalculated: update
          feedback = await updateData(
            'Emolument',
            emolumentData,
            { prId: pensioneer.id, paymentId: paymentId },
            null,
            transaction
          );
        } else {
          //-- just calculated: insert
          feedback = await createData(
            'Emolument',
            emolumentData,
            null,
            transaction
          );
          pensioneerChanged.push(pensioneer);
        }

        if (feedback.success) {
          if (emolumentMisc.length > 0) {
            for (let misc of emolumentMisc) {
              misc.emId = feedback.result.id;
              misc.mixedId = Number(`${misc.miscId}${misc.emId}`);
            }

            feedback = await createData(
              'EmolumentMiscellanous',
              emolumentMisc,
              null,
              transaction,
              true,
              ['subTotalAmount']
            );
          }
        } else {
          break;
        }
      }
      if (feedback.success) {
        //-- commit transaction
        await transaction.commit();
        if (paymentType === PaymentType.Gratuity) {
          // update pensioneer gratuity status
          await updateData('Pensioneer', { gratuityStatus: 'paid' });
        }

        if (paymentType === PaymentType.Pension) {
          // update all pensioneers record who received pension.
          for (let pensioneer of pensioneerChanged) {
            await updateData(
              'Pensioneer',
              {
                pensionCount: pensioneer.pensionCount + 1,
              },
              { id: pensioneer.id }
            );
          }
        }

        //-- feedback
        feedback = new Feedback([], true, 'success');
      }
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.updateEmolument = async (req, res, next) => {
  const transaction = await BaseModel.sequelize.transaction();
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;

  if (authUser) {
    try {
      let emolumentData = createEmolument(formData);
      let pensioneer = createPensioneer(formData.Pensioneer);
      let miscellanous = formData.Miscellanous;
      let { emolument, emolumentMisc } = await calculateEmolument(
        pensioneer,
        miscellanous,
        emolumentData.paymentId
      );
      emolument.status = emolumentData.status;

      for (let misc of emolumentMisc) {
        misc.emId = emolumentData.id;
        misc.mixedId = Number(`${misc.miscId}${misc.salaryId}`);
      }

      //-- recalculated: update
      feedback = await updateData(
        'Emolument',
        emolument,
        { id: emolumentData.id },
        null,
        transaction
      );

      if (feedback.success) {
        feedback = await createData(
          'EmolumentMiscellanous',
          emolumentMisc,
          null,
          transaction,
          true,
          ['subTotalAmount']
        );
      }

      if (feedback.success) {
        //-- commit transaction
        await transaction.commit();
        //-- feedback
        feedback = new Feedback(
          await BaseModel.Emolument.findOne({
            where: { id: emolumentData.id },
            include: [
              {
                model: BaseModel.Pensioneer,
                include: Constants.PensioneerIncludes,
              },
              {
                model: BaseModel.EmolumentMiscellanous,
                include: [
                  {
                    model: BaseModel.Miscellanous,
                  },
                ],
              },
            ],
          }),
          true,
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.deleteEmolument = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  try {
    if (authUser) {
      result = await deleteData(Model, {
        field: 'id',
        value: id,
      });

      feedback = new Feedback(result, true, 'deleted successfully.');
      feedback.message = Boolean(feedback.result)
        ? feedback.message
        : 'no data was deleted';
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

exports.emolumentSummary = async (req, res, next) => {
  let { pid, authorization } = Sanitizer.sanitize(req.query);
  let authUser = GetAuthUser(authorization);
  let feedback;
  try {
    if (authUser) {
      let totalMiscellanous = await BaseModel.EmolumentMiscellanous.findAll({
        attributes: [
          [
            BaseModel.Sequelize.fn(
              'sum',
              BaseModel.Sequelize.col('subTotalAmount')
            ),
            'total',
          ],
        ],
        where: { paymentId: pid },
        group: ['miscId'],
        order: [[BaseModel.Miscellanous, 'title', 'ASC']],
        include: { model: BaseModel.Miscellanous, attributes: ['title'] },
      });

      let totalPensioneers = await BaseModel.Emolument.count({
        where: { paymentId: pid },
      });

      let totalPensioneersGroup = await BaseModel.Emolument.findAll({
        where: { paymentId: pid },
        attributes: [
          [
            BaseModel.Sequelize.fn('count', BaseModel.Sequelize.col('prId')),
            'total',
          ],
        ],
        include: [
          {
            model: BaseModel.Pensioneer,
            attributes: ['classId'],
            include: { model: BaseModel.StaffClass },
          },
        ],
        group: ['Pensioneer.classId'],
      });

      let totalEmolument = await BaseModel.Emolument.sum('netPay', {
        where: { paymentId: pid },
      });

      feedback = new Feedback(
        {
          totalMiscellanous,
          totalPensioneers,
          totalPensioneersGroup,
          totalEmolument,
        },
        true,
        'success'
      );
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};
