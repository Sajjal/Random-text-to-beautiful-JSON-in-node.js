const fs = require('fs');

let writeMainDb = fs.createWriteStream('mainDatabase.json');

let authorSubString, titleSubString, AbstractSubString, pub_dateSubString, more_infoSubString;
let mainRecords = [{}];
let authorIndex = [{}];
let titleIndex = [{}];

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

let rawFile = 'eric2000.txt'

fs.readFile(rawFile, (err, data) => {
    if (err) throw err;
    let regexData = /Authors: (.*?)Language: /gs;
    let dataMatch;
    let recordCount = 0;

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

        mainRecords[recordCount] = {
            id: recordCount + 1,
            author: authorArray[recordCount],
            title: titleArray[recordCount],
            pub_date: pub_dateArray[recordCount],
            more_info: more_infoArray[recordCount],
            abstract: abstractArray[recordCount]
        };
        recordCount++;
    }

    formattedData = JSON.stringify(mainRecords, null, 4);  
    writeMainDb.write(formattedData);
    console.log("Beautiful JSON file: 'data.json' is Generated Successfully.")

});
