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
    if (program) {
        let path = program.path;        
        var files = fs.readdirSync(path);        
        let versions = [];
        files.forEach(file => {            
            let v = fs.readJsonSync(path + file);            
            versions.push({
                version: v.version,
                releaseDate: v.releaseDate,
                type: v.type
            });

        });
        
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


exports.changeLogRelease = function (param) {
    let changeLogs = this.changeLogLoad({
        programId: param.programId,
        version: param.version
    });
    console.log("param.releaseDate", param.releaseDate);
    changeLogs.releaseDate = param.releaseDate;    
    this.changeLogFileSave(param.programId, param.version, changeLogs);
}

exports.changeLogFileSave = function (programId, version, changeLogs) {
    let config = configDao.mainConfigLoad();
    let program = configHelpers.getProgramById(config, programId);    
    fs.writeJsonSync(program.path + "/" + "changelog." + version + ".json", changeLogs, {spaces: "\t"});
}

exports.newVersion = function (programId, version) {
    let changeLogs = {
        version: version,
        changes: []};
    this.changeLogFileSave(programId, version, changeLogs);
}

