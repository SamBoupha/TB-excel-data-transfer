const fs = require('fs');
const path = require('path');

const header = '<?xml version="1.0" encoding="UTF-8"?>\r\n<dataValueSet xmlns="http://dhis2.org/schema/dxf/2.0">\r\n';
const closing = '</dataValueSet>';

const importFileName = path.join(path.dirname(__dirname),'/output/import.xml'); 

const writeToFile = (dataToAppend) => {
    
    const xml = header + dataToAppend + closing;

    fs.open(importFileName, 'wx', (err, fd) => {
        if (err) {
            if (err.code === 'EEXIST') {
                console.log(`${importFileName} exists. Removing it. . .`);
                fs.unlink(importFileName, () => {
                    console.log(`${importFileName} removed`);
                    fs.appendFile(importFileName, xml, (err) => {
                        if (err) throw err;
                        console.log(`${importFileName} is created.`);  
                    });
                });
            }
        } else {
            fs.appendFile(importFileName, xml, (err) => {
                if (err) throw err;
                console.log(`${importFileName} is created.`);  
            });
        }
    });
}

module.exports = { writeToFile }