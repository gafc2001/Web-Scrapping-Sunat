"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportData = void 0;
const excelJS = require("exceljs");
const { Cell } = excelJS;
const exportData = (Data, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
    const path = "./src/files"; // Path to download excel
    // Column for data in excel. key must match data key
    let colums = Object.keys(Data[0]).map(el => {
        return {
            header: el,
            key: el,
            width: 15,
        };
    });
    colums = [
        {
            header: "S no.",
            key: "s_no",
            width: 10
        },
        ...colums
    ];
    worksheet.columns = colums;
    let counter = 1;
    Data.forEach((row) => {
        row.s_no = counter;
        worksheet.addRow(row); // Add data in worksheet
        counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    try {
        yield workbook.xlsx.writeFile(`${path}/${fileName}`);
        return `${path}/${fileName}`;
    }
    catch (err) {
        return err.message;
    }
});
exports.exportData = exportData;
//# sourceMappingURL=exportar.js.map