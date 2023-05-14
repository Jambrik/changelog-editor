import { IVersionMetaData } from '../models/IVersionMetaData';
import { Program } from '../models/Program';

export class ConfigHelper {
    static getProgramById(programs: Program[], id: number) {
        for (const program of programs) {
            if (program.id === id) {
                return program;
            }
        }

        return null;
    }

    static versionSorter = (a: IVersionMetaData, b: IVersionMetaData) => {
        if (a.version < b.version) {
            return 1;
        } else if (a.version === b.version) {
            return 0;
        } else {
            return -1;
        }
    }

    static getVersion(versions: IVersionMetaData[], versionNumber: string): IVersionMetaData {
        let result: IVersionMetaData = null;
        versions.forEach(v => {
            if (v.version === versionNumber) {
                result = v;
            }
        });
        console.log('Not found version', versionNumber);
        return result;
    }

}
