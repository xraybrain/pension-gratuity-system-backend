const BaseModel = require('../db/models/index');
const { MiscType } = require('./models/MiscType');
const { Emolument } = require('./models/Emolument');
const { EmolumentMisc } = require('./models/EmolumentMisc');
const { PaymentType } = require('./models/PaymentType');
const { Formula } = require('./models/Formula');
const moment = require('moment');

exports.calculateEmolument = async (
  pensioneer = {},
  miscellanous = [],
  paymentId,
  pType = PaymentType.Pension
) => {
  // Get Annual Salary
  let salaryStrList = await BaseModel.SalaryStructureList.findOne({
    where: {
      structureId: pensioneer.structureId,
      level: pensioneer.level,
      grade: pensioneer.grade,
    },
  });
  let annualSalary = 0;
  if (salaryStrList) {
    annualSalary = parseFloat(salaryStrList.annualSalary);
  }

  // Calculate consolidated payment
  let consolidated = 0;
  if (annualSalary && annualSalary !== 0) {
    consolidated = parseFloat((annualSalary / 12).toFixed(2));
  }

  // Calculate employees years of service using date of employment and date of retirement
  let YOS = moment(pensioneer.dateOfRet).diff(pensioneer.dateOfEmp, 'years');

  // Get calculation percentage from Formula
  let formula = new Formula();
  formula = await BaseModel.Formula.findOne({ where: { YOS } });
  let percent = 0;

  if (formula && pType == PaymentType.Gratuity)
    percent = (Number(formula.GP) || 0) / 100;
  if (formula && pType == PaymentType.Pension)
    percent = (Number(formula.PP) || 0) / 100;

  // console.log('Ln: 42', formula, percent);

  let grossPay = consolidated;
  let netPay = 0.0;
  let totalDeducted = 0.0;
  let emolumentMisc = [];

  if (miscellanous && miscellanous.length > 0) {
    let calculated;
    for (let misc of miscellanous) {
      // calculate earnings
      calculated = calculate(
        MiscType.Allowance,
        misc,
        pensioneer,
        consolidated,
        grossPay
      );
      grossPay += calculated.amount;
      if (calculated.misc)
        emolumentMisc.push(
          new EmolumentMisc(
            null,
            calculated.misc.id,
            paymentId,
            null,
            calculated.amount
          )
        );

      // calculate deductions
      calculated = calculate(
        MiscType.Deduction,
        misc,
        pensioneer,
        consolidated,
        grossPay
      );
      totalDeducted += calculated.amount;
      if (calculated.misc)
        emolumentMisc.push(
          new EmolumentMisc(
            null,
            calculated.misc.id,
            paymentId,
            null,
            calculated.amount
          )
        );
    }
  }

  netPay = (grossPay - totalDeducted) * percent;

  console.log('Net Pay: ', netPay);

  return {
    emolumentMisc,
    emolument: new Emolument(
      pensioneer.id,
      pensioneer.bankId,
      paymentId,
      'active',
      consolidated,
      grossPay,
      totalDeducted,
      netPay
    ),
  };
};

const calculateMisc = (
  misc = {},
  miscType = MiscType.Allowance,
  consolidated = 0.0,
  grossPay = 0.0
) => {
  let amount = 0.0;
  if (misc.category === miscType) {
    if (misc.isCalculated) {
      let percent = parseFloat(misc.percent);
      if (misc.derivedFrom.toLowerCase() === 'consolidated') {
        amount = (percent / 100) * consolidated;
      } else if (misc.derivedFrom.toLowerCase() === 'grosspay') {
        amount = (percent / 100) * grossPay;
      } else {
        amount = 0.0;
      }
    } else {
      amount = parseFloat(misc.amount || 0);
    }
  }
  return parseFloat(amount.toFixed(2));
};

const calculate = (
  miscType,
  misc = {},
  pensioneer = {},
  consolidated = 0.0,
  grossPay = 0.0
) => {
  let calculated = { amount: 0.0, misc: null };

  if (misc.category === miscType) {
    // class restriction
    if (misc.classId && pensioneer.classId === misc.classId) {
      if (misc.level && pensioneer.level >= misc.level) {
        calculated.amount += calculateMisc(
          misc,
          miscType,
          consolidated,
          grossPay
        );
        calculated.misc = misc;
      } else if (!misc.level) {
        calculated.amount += calculateMisc(
          misc,
          miscType,
          consolidated,
          grossPay
        );
        calculated.misc = misc;
      } else {
        // do nothing
      }
    }
    // gender restriction
    else if (
      misc.genderRestricted &&
      pensioneer.gender === misc.genderRestricted
    ) {
      calculated.amount += calculateMisc(
        misc,
        miscType,
        consolidated,
        grossPay
      );
      calculated.misc = misc;
    }
    // No restriction
    else if (!misc.classId && !misc.level && !misc.genderRestricted) {
      calculated.amount += calculateMisc(
        misc,
        miscType,
        consolidated,
        grossPay
      );
      calculated.misc = misc;
    } else {
      // do nothing
    }
  }
  return calculated;
};
