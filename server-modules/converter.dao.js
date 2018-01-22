var fs = require('fs-extra');
var configDao = require('./config.dao');
var idGenerator = require('./id-generator');

exports.convertFromOldFormat = function (oldChangeLogList){
    let newChangeLogList = {
        version: oldChangeLogList.version,
        changes: []
    }

    
    if(oldChangeLogList && oldChangeLogList.changes){        
        oldChangeLogList.changes.forEach(change => {                    
            newChangeLogList.changes.push(
                {   id: idGenerator.getNext(),
                    date: new Date(change.date),
                    ticketNumber: change.lgw,
                    type: change.type,
                    importance: "normal",
                    descriptions: [{
                        lang: "hu",
                        text: change.hu
                    },
                    {
                        lang: "en",
                        text: change.en
                    }],
                    keywords: []
                }
            );            
        });
    }       
    return newChangeLogList;
}

exports.convertAll = () => {
    let config = configDao.mainConfigLoad();    
    config.programs.forEach((program) => {
        let configPartsPaths = fs.readdirSync(program.path);                                    
        for (var i = 0; i < configPartsPaths.length; i++) {
            let path = program.path + configPartsPaths[i];            
            let oldChangeLog = fs.readJsonSync(path);            
            let newChangeLog = this.convertFromOldFormat(oldChangeLog);  
            fs.writeJson(path+"2.json", newChangeLog, {spaces: "\t"});
        }


    })
}