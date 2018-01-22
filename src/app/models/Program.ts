import { IProgram } from "./IProgram";
import { ICategory } from "./ICategory";
import { IKeyword } from "./IKeyword";
import { IVersionMetaData } from "./IVersionMetaData";

export class Program implements IProgram {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public langs: string[],
        public versions: IVersionMetaData[],
        public categories: ICategory[],
        public keywords: IKeyword[]) {
    }

    get langList(): string {
        let langList = "";
        this.langs.forEach(lang => {
            langList = langList + lang + ", ";
        });
        if (langList != "") {
            langList = langList.substring(0, langList.length - 2);
        }
        return langList;
    }
}