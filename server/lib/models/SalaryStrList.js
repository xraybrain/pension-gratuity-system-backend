exports.SalaryStrList = class {
  constructor(
    structureId = null,
    level = null,
    grade = null,
    annualSalary = null,
    id = null
  ) {
    if (structureId) this.structureId = structureId;
    if (level) this.level = level;
    if (grade) this.grade = grade;
    if (annualSalary) this.annualSalary = annualSalary;
    if (id) this.id = id;
  }
};

exports.createSalaryStrList = (listJSON, structureId) => {
  let list = [];
  for (let row of listJSON) {
    let level = row.Level;
    delete row.Level;
    for (let [grade, annualSalary] of Object.entries(row)) {
      list.push(
        new this.SalaryStrList(structureId, level, grade, annualSalary)
      );
    }
  }

  return list;
};
