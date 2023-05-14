import { IVersionMetaData } from './IVersionMetaData';
import { Program } from './Program';
import { TagInfo } from './TagInfo';

export class ProgramImpl implements Program {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public langs: string[],
        public versions: IVersionMetaData[],
        public tagInfos: TagInfo[]) {
    }

    get langList(): string {
        let langList = '';
        this.langs.forEach(lang => {
            langList = langList + lang + ', ';
        });
        if (langList !== '') {
            langList = langList.substring(0, langList.length - 2);
        }
        return langList;
    }
}
