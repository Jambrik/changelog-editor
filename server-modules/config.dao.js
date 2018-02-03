var fs = require('fs-extra');
var configHelper = require('./config-helpers');
var changeLogDao = require('./change-log.dao');

exports.mainConfigLoad = function() {        
    //Reading the common settings, (program name and language)
    let configCommon = fs.readJsonSync('change-log-editor-common.config.json');            
    //Reading the personal part: (program path)
    let configPersonal = fs.readJsonSync('change-log-editor-personal.config.json');        
    configHelper.configFilesMerge(configCommon, configPersonal);
    //GetVersionInfo:
    configCommon.programs.forEach(program => {
        let versions = changeLogDao.getVersionsByProgram(program);
        program.versions = versions;
        let tagInfos = changeLogDao.getTaginfos(program);        
        if(tagInfos) {
            program.tagInfos = tagInfos;
        }
    });
    return configCommon;
}