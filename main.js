const fs = require('fs');

let id, author, title, pub_date, more_info, abstract, formattedData;
let mainRecords = { id, author, title, pub_date, more_info, abstract };

let authorSubString, titleSubString, AbstractSubString, pub_dateSubString, more_infoSubString;

let authorArray = [],
    authorObj = {};
let titleArray = [],
    titleObj = {};
let abstractArray = [],
    abstractObj = {};
let pub_dateArray = [],
    pub_dateObj = {};
let more_infoArray = [],
    moreinfoObj = {};

module.exports = {
    getData: async function(rawFile) {
        
    let writeMainDb = fs.createWriteStream('mainDatabase.json');
        
fs.readFile(rawFile, (err, data) => {
    if (err) throw err;
    let regexData = /Authors: (.*?)Language: /gs;
    let dataMatch;
    let recordCount = 0,
        count = 30;

    while (dataMatch = regexData.exec(data)) {
        let str = dataMatch[1];

        authorSubString = str.split('Authors:').pop().split('\r\n')[0];
        authorObj = authorSubString.replace(" ", "");
        authorObj = authorObj.replace(",", "");
        authorArray.push(authorObj);

        titleSubString = str.substring(
            str.lastIndexOf("Title:") + 8,
            str.lastIndexOf(" /")
        );
        titleObj = titleSubString.replace("\r\n", "");
        titleArray.push(titleObj);

        pub_dateSubString = str.split('Pub.Date:').pop().split('\r\n')[0];
        pub_dateObj = pub_dateSubString.replace("  ", "");
        pub_dateArray.push(pub_dateObj);

        more_infoSubString = str.split('FOUND IN:').pop().split('\r\n')[0];
        more_infoObj = more_infoSubString.replace("  ", "");
        more_infoArray.push(more_infoObj);

        abstractSubString = str.substring(
            str.lastIndexOf("Abstract:") + 11,
            str.lastIndexOf(" (")
        );
        abstractObj = abstractSubString.replace(/\r\n/g, "");
        abstractArray.push(abstractObj);

        mainRecords.id = recordCount + 1;
        mainRecords.author = authorArray[recordCount];
        mainRecords.title = titleArray[recordCount];
        mainRecords.pub_date = pub_dateArray[recordCount];
        mainRecords.more_info = more_infoArray[recordCount];
        mainRecords.abstract = abstractArray[recordCount];

        recordCount++;

        if (recordCount == 1) {
            formattedData = "[" + JSON.stringify(mainRecords, null, 4) + ",";
        } else if (recordCount > 1 && recordCount < count) {
            formattedData = JSON.stringify(mainRecords, null, 4) + ",";
        } else if (recordCount == count) {
            formattedData = JSON.stringify(mainRecords, null, 4) + "]";
        }
        writeMainDb.write(formattedData);
    }
});
    }
}
