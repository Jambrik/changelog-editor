exports.getProgramById = (config, programId) => {    
    for(var i =0; i< config.programs.length; i++ ){
        if(config.programs[i].id == programId){
            return config.programs[i];
        }
        
    }

}

exports.configFilesMerge =(common, personal) => {  
    common.user = personal.user;  
    common.programs.forEach(program => {
        let personalProgram = this.getProgramById(personal, program.id);
            program.path = personalProgram.path;        
    });

}