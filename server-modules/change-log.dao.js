var configDao = require('./config.dao');
var configHelpers = require('./config-helpers');
var idGenerator = require('./id-generator');
var fs = require('fs-extra');

exports.changeLogLoad = function (param) {
    let config = configDao.mainConfigLoad();
    if (config) {
        let program = configHelpers.getProgramById(config, param.programId);
        if (program) {
            let cl = fs.readJsonSync(program.path + "changelog" + '.' + param.version + '.json');
            return cl;
        }
    }
    return null;
};


exports.changeLogVersions = function (param, res) {        
    if (param.programId) {
        let config = configDao.mainConfigLoad();
        if (config) {
            let program = configHelpers.getProgramById(config, param.programId);
            if (program) {                
                let versions = this.getVersionsByProgram(program);                
                res.json(versions);
            }
        }
    }



};

exports.getVersionsByProgram = function (program) {
    console.log("in the getVersionsByProgram");
    console.log((program) ? "pr defined" : "prundef");
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

exports.changeLogSave = function (param) {
    let changeLogs = this.changeLogLoad({
        programId: param.programId,
        version: param.version
    });
    if (param.item.id == null) {
        let id = idGenerator.getNext();
        param.item.id = id;
        changeLogs.changes.push(param.item);
    } else {
        changeLogs.changes.forEach(item => {
            if (item.id == param.item.id) {
                item.date = param.item.date;
                item.ticketNumber = param.item.ticketNumber;
                item.type = param.item.type;
                item.descriptions = param.item.descriptions;
                item.category = param.item.category;
                item.subCategory = param.item.subCategory;
                item.keywords = param.item.keywords;
                item.lmu = param.item.lmu;
                item.lmd = param.item.lmd;
            }
        });
    }

    this.changeLogFileSave(param.programId, param.version, changeLogs);

}

exports.changeLogDelete = function (param) {
    let changeLogs = this.changeLogLoad({
        programId: param.programId,
        version: param.version
    });
    let deleteItemIndex = null;
    let i = 0;
    changeLogs.changes.forEach(item => {
        if (item.id == param.id) {
            deleteItemIndex = i;
        }
        i++;
    });
    changeLogs.changes.splice(deleteItemIndex, 1);
    this.changeLogFileSave(param.programId, param.version, changeLogs);
}

exports.changeLogFileSave = function (programId, version, changeLogs) {
    let config = configDao.mainConfigLoad();
    let program = configHelpers.getProgramById(config, programId);
    console.log("changeLogSave programId", programId);
    fs.writeJsonSync(program.path + "/" + "changelog." + version + ".json", changeLogs);
}

exports.newVersion = function (programId, version) {
    let changeLogs = {changes: []};
    this.changeLogFileSave(programId, version, changeLogs);
}

