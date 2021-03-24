exports.Miscellanous = class {
  constructor(
    level = null,
    classId = null,
    title = null,
    percent = null,
    derivedFrom = null,
    isCalculated = null,
    amount = null,
    category = null,
    genderRestricted = null,
    id = null
  ) {
    if (level) this.level = level;
    if (classId) this.classId = classId;
    if (title) this.title = title;
    if (percent) this.percent = percent;
    if (derivedFrom) this.derivedFrom = derivedFrom;
    if (isCalculated === false || isCalculated)
      this.isCalculated = isCalculated;
    if (amount >= 0) this.amount = amount;
    if (Number(category) === 0 || Number(category) === 1) this.category = category;
    if (genderRestricted) this.genderRestricted = genderRestricted;
    if (id) this.id = id;
  }
};

exports.createMiscellanous = (formData = {}) => {
  return new this.Miscellanous(
    formData.level,
    formData.classId,
    formData.title,
    formData.percent,
    formData.derivedFrom,
    formData.isCalculated,
    formData.amount,
    formData.category,
    formData.genderRestricted,
    formData.id
  );
};
