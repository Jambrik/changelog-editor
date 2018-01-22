import { IProgram } from "../models/IProgram";
import { IVersionMetaData } from "../models/IVersionMetaData";
import { version } from "punycode";

export class ConfigHelper {
    static getProgramById(programs: IProgram[], id: number) {
        for (let program of programs) {
            if (program.id == id) {
                return program;
            }
        }

        return null;
    }

    static versionSorter = (a: IVersionMetaData, b: IVersionMetaData) => {
        if (a.version < b.version)
            return 1;
        else if (a.version == b.version) {
            return 0;
        } else {
            return -1;
        }
    }

    static getVersion(versions: IVersionMetaData[], versionNumber: string): IVersionMetaData{
        let result: IVersionMetaData = null;
        versions.forEach(version => {
            if(version.version == versionNumber){
                result = version;
            }
        });
        console.log("Not found version", versionNumber);
        return result;
    }

}