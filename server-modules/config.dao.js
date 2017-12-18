var fs = require('fs-extra');
var configHelper = require('./config-helpers');

exports.mainConfigLoad = function() {
    console.log("Config reading");
    //Reading the common settings, (program name and language)
    let configCommon = fs.readJsonSync('change-log-editor-common.config.json');        
    //Reading the personal part: (program path)
    let configPersonal = fs.readJsonSync('change-log-editor-personal.config.json');        
    configHelper.configFilesMerge(configCommon, configPersonal);
    return configCommon;
}