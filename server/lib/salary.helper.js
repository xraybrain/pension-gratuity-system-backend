const BaseModel = require('../db/models/index');
const { Constants } = require('./models/Constants');
const { MiscType } = require('./models/MiscType');
const { Salary } = require('./models/Emolument');
const { SalaryMisc } = require('./models/EmolumentMisc');

exports.calculateSalary = async (staff = {}, miscellanous = [], payrollId) => {
  let salaryStrList = await BaseModel.SalaryStructureList.findOne({
    where: {
      structureId: staff.salaryStrId,
      level: staff.level,
      grade: staff.grade,
    },
  });
  let annualSalary = 0;
  if (salaryStrList) {
    annualSalary = parseFloat(salaryStrList.annualSalary);
  }

  let consolidated = 0;

  if (annualSalary && annualSalary !== 0) {
    consolidated = parseFloat((annualSalary / 12).toFixed(2));
  }

  let grossPay = consolidated;
  let netPay = 0.0;
  let totalDeducted = 0.0;
  let salaryMisc = [];

  if (miscellanous && miscellanous.length > 0) {
    let calculated;
    for (let misc of miscellanous) {
      calculated = calculate(
        MiscType.Allowance,
        misc,
        staff,
        consolidated,
        grossPay
      );
      grossPay += calculated.amount;

      if (calculated.misc)
        salaryMisc.push(
          new SalaryMisc(
            null,
            calculated.misc.id,
            payrollId,
            null,
            calculated.amount
          )
        );
      calculated = calculate(
        MiscType.Deduction,
        misc,
        staff,
        consolidated,
        grossPay
      );
      totalDeducted += calculated.amount;
      if (calculated.misc)
        salaryMisc.push(
          new SalaryMisc(
            null,
            calculated.misc.id,
            payrollId,
            null,
            calculated.amount
          )
        );
    }
  }

  netPay = grossPay - totalDeducted;

  return {
    salaryMisc,
    salary: new Salary(
      staff.id,
      staff.bankId,
      payrollId,
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
  staff = {},
  consolidated = 0.0,
  grossPay = 0.0
) => {
  let calculated = { amount: 0.0, misc: null };

  if (misc.category === miscType) {
    if (misc.classId && staff.classId === misc.classId) {
      if (misc.level && staff.level >= misc.level) {
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
    } else if (
      misc.genderRestricted &&
      staff.gender === misc.genderRestricted
    ) {
      calculated.amount += calculateMisc(
        misc,
        miscType,
        consolidated,
        grossPay
      );
      calculated.misc = misc;
    } else if (!misc.classId && !misc.level && !misc.genderRestricted) {
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
