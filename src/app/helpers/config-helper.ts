import { IProgram } from "../models/IProgram";

export class ConfigHelper {
    static getProgramById(programs: IProgram[], id: number){
        for(let program of programs){
            if( program.id == id){
                return program;
            }
        }

        return null;
    }
}