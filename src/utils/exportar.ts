const excelJS = require("exceljs");

const { Cell } = excelJS;
export const exportData = async (Data : any, fileName : string) => {
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
    const path = "./src/files"; // Path to download excel
    // Column for data in excel. key must match data key
    let colums = Object.keys(Data[0]).map( el => {
        return { 
            header: el,
            key: el, 
            width: 15,
        }
    });
    colums = [
        {
            header: "S no.", 
            key: "s_no", 
            width: 10
        },
        ...colums
    ]
    worksheet.columns = colums;
    let counter = 1;
    Data.forEach((row : typeof Cell) => {
        row.s_no = counter;
        worksheet.addRow(row); // Add data in worksheet
        counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell : any) => {
        cell.font = { bold: true };
    });
    try {
        await workbook.xlsx.writeFile(`${path}/${fileName}`);
        return `${path}/${fileName}`;
    } catch (err : any) {
        return err.message;
    }
};
