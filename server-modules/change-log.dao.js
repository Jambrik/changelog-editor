

var configDao = require('./config.dao');
var configHelpers = require('./config-helpers');

var fs = require('fs-extra');

exports.changeLogLoad = function (param, res) {
    let config = configDao.mainConfigLoad();
    if (config) {
        let program = configHelpers.getProgramById(config, param.programId);
        if (program) {
            let cl = fs.readJsonSync(program.path + "changelog" + '.' + param.version + '.json');
            res.json(cl);
        }
    }
};

exports.changeLogVersions = function (param, res) {
    //Get the program path:
    console.log("in the changeLogVersion");
    console.log("programId", param.programId);
    if (param.programId) {
        let config = configDao.mainConfigLoad();
        if (config) {
            let program = configHelpers.getProgramById(config, param.programId);
            if (program) {
                console.log("before getVersionsByProgram");
                let versions = this.getVersionsByProgram(program);
                console.log("after getVersionsByProgram");
                res.json(versions);
            }
        }
    }



};

exports.getVersionsByProgram = function (program) {
    console.log("in the getVersionsByProgram");
    console.log((program)?"pr defined": "prundef");
    if (program) {
        let path = program.path;
        console.log("path", path);
        var items = fs.readdirSync(path);
        console.log("getVersionsByProgram.items", items);
        let versions = [];
        for (var i = 0; i < items.length; i++) {
            versions.push(items[i].substring(items[i].length - 13, items[i].length - 5));
        }

        return versions;
    }
}

exports.changeLogSave = function (cl) {

}