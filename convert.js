'use strict';
const { promises: fs } = require("fs");
const vanilla = require("fs");


async function doConvert(fileName, fileToWrite) {
    let rawdata = await fs.readFile(fileName);
    let data = JSON.parse(rawdata);
    const timecodeslength = data.elapsed.length;
    const arrayDataNames = [];

    for (let attribute in data) {
        const obj = data[attribute];
        if (Array.isArray(obj)) {
            if (obj.length == timecodeslength && attribute != 'elapsed') {
                arrayDataNames.push(attribute);
            }
        }
    }
    const stream = vanilla.createWriteStream(fileToWrite);
    stream.write('"GPS Time","' + arrayDataNames.join('","') + '"\r\n');
    let index = 0;
    data.elapsed.forEach(eleapsed => {
        const constValues = arrayDataNames.map((bane) => {
            return data[bane][index];
        });
        stream.write((data.elapsed[index]+data.start) + "," + constValues.join(',')+'\r\n');
        index++;
    });
    stream.end();
}

const fileName = process.argv[2];
const fileName2 = process.argv[2] + ".out.csv";
doConvert(fileName, fileName2).then(() => {
    console.log("done");
}).catch((errir) => {
    console.log(errir);
})

