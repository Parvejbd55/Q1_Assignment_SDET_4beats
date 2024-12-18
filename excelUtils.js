const XLSX = require("xlsx");

function readExcel(filePath, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

function writeExcel(filePath, sheetName, data) {
    const workbook = XLSX.readFile(filePath);
    const sheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = sheet;
    XLSX.writeFile(workbook, filePath);
}

module.exports = { readExcel, writeExcel };
