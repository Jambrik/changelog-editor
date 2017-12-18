

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
                let path = program.path;
                console.log("path", path);
                fs.readdir(path, function (err, items) {
                    if (err)
                        throw err;
                    let versions = [];
                    for (var i = 0; i < items.length; i++) {
                        versions.push(items[i].substring(items[i].length - 13, items[i].length - 5));
                    }

                    res.json(versions);
                });
            }
        }
    }



};


exports.changeLogSave = function (cl) {

}