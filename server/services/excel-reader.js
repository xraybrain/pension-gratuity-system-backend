/**
 * Module dependencies
 */
const xlsx = require('xlsx');

const toJson = (workbook) => {
  var result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });
  return result;
};

exports.excelReader = (fileName) => {
  var workbook = xlsx.readFile(fileName);
  return toJson(workbook);
};
