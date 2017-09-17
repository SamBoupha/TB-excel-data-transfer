const xlsx = require('xlsx');
const { writeToFile } = require('./utils');

const dataBook = xlsx.readFile("data/data.xlsx");
const orgUnitBook = xlsx.readFile("data/orgunit.xlsx");

const column = ['C','D','E','F','I'];
const Quarter = ['2016Q1', '2016Q2', '2016Q3', '2016Q4'];
const dataElementIDs = ['vyR1CsU1BuE','HOYM2uCqW8F','QbxU9kqyBQg','rwMvv66Vdy3','UWFFsZQu2AM'];

const outputXML = (dataElement, period, orgUnit, value) => {
    return `<dataValue dataElement='${dataElement}' period='${period}' orgUnit='${orgUnit}' categoryOptionCombo='lmbxvugTvKr' value='${value}' />\r\n`;
}

let xml = '';

for( var i=0; i<19; i++) {

    let orgSheetName = orgUnitBook.SheetNames[i];
    let orgSheet = orgUnitBook.Sheets[orgSheetName];

    let orgUnitIds = [];

    for(var j=4;j<20;j++) {
        if( orgSheet[`B${j}`].v === "2016Q2" ) break;
        orgUnitIds.push(orgSheet[`A${j}`].v);
    }

    let dataSheetName = dataBook.SheetNames[i+1];
    let dataSheet = dataBook.Sheets[dataSheetName];
    let rowCounter = 0;
    let orgUnitCounter = 0;

    for(var row=9; row<(orgUnitIds.length*5)+9; row++) {
        if(rowCounter == 4) {
            rowCounter = 0;
            orgUnitCounter++;
            continue;
        }
        column.forEach(function(c, index) {
            let value = 0;
            if(typeof dataSheet[`${c}${row}`] !== 'undefined') {
                value = dataSheet[`${c}${row}`].v;
            }
            const xmlDataTag = outputXML(dataElementIDs[index],Quarter[parseInt(rowCounter)],orgUnitIds[parseInt(orgUnitCounter)],value)
            xml += xmlDataTag; 
        });
        rowCounter++;
    }
}

writeToFile(xml);