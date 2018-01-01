var fs = require('fs-extra');

exports.getNext = function(){

    let idGeneratorJson = fs.readJsonSync('./server-modules/id-generator.json');
    let id = idGeneratorJson.id;
    if(!id){
        id=0;
    } else {
        id++;
    }
    idGeneratorJson.id = id;
    fs.writeJsonSync("./server-modules/id-generator.json", idGeneratorJson);
    return id;
}