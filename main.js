const fs = require('fs');
const lineReader = require('line-reader');
let writeStream = fs.createWriteStream('data.json');
let id, authors, title, pub_date, more_info, abstract, formattedData, recordCount = 0;
var records = { id, authors, title, pub_date, more_info, abstract };
var mySubStringTitle, mySubStringAbstract, titleCount = 0,
    abstractCount = 0;
var titles = [];
var abstracts = [];

module.exports = {
    getData: async function(filename) {

        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            var input = data;
            var regexTitle = /Title: (.*?)Pub.Date: /gs;
            var matchesTitle;

            while (matchesTitle = regexTitle.exec(input)) {
                titles[titleCount] = {};
                let str = matchesTitle[1];
                mySubStringTitle = str.substring(
                    str.lastIndexOf("Title: ") + 1,
                    str.lastIndexOf(" /")
                );
                titles[titleCount] = mySubStringTitle.replace("\r\n", "");
                titles.push(titles[titleCount]);
                titleCount++;
            }
            var regexAbstract = /Abstract: (.*?)Pub.Type: /gs;
            var matchesAbstract;
            while (matchesAbstract = regexAbstract.exec(input)) {
                abstracts[abstractCount] = {};
                let strAbstract = matchesAbstract[1];
                mySubStringAbstract = strAbstract.substring(
                    strAbstract.lastIndexOf("Abstract: ") + 1,
                    strAbstract.lastIndexOf(" (")
                );
                abstracts[abstractCount] = mySubStringAbstract.replace(/\r\n/g, "");
                abstracts.push(abstracts[abstractCount]);
                abstractCount++;
            }


            lineReader.eachLine(filename, function(line) {

                if (line.includes("Authors: ")) {
                    records.authors = line.substring(10);
                    recordCount++;
                    records.id = recordCount;
                    records.title = titles[recordCount - 1];
                    records.abstract = abstracts[recordCount - 1];
                } else if (line.includes("Pub.Date: ")) {
                    records.pub_date = line.substring(11);
                } else if (line.includes("FOUND IN: ")) {
                    records.more_info = line.substring(11);

                    if (recordCount == 1) {
                        formattedData = "[" + JSON.stringify(records, null, 4) + ",";
                    } else if (recordCount > 1 && recordCount < titleCount) {
                        formattedData = JSON.stringify(records, null, 4) + ",";
                    } else if (recordCount == titleCount) {
                        formattedData = JSON.stringify(records, null, 4) + "]";
                    }
                    writeStream.write(formattedData);
                }
            });
        })
    }
}