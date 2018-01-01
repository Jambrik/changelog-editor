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
    console.log("convertAll: config loaded");
    config.programs.forEach((program) => {
        let configPartsPaths = fs.readdirSync(program.path);                            
        console.log("convertAll: configPartsPaths loaded:", configPartsPaths);
        for (var i = 0; i < configPartsPaths.length; i++) {
            let path = program.path + configPartsPaths[i];
            console.log("change-logs-path: ", path);
            let oldChangeLog = fs.readJsonSync(path);            
            let newChangeLog = this.convertFromOldFormat(oldChangeLog);  
            fs.writeJson(path+"2.json", newChangeLog);
        }


    })
}