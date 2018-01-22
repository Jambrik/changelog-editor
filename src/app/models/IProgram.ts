import { ICategory } from "./ICategory";
import { IKeyword } from "./IKeyword";
import { IVersionMetaData } from "./IVersionMetaData";

export interface IProgram {
    id: number;
    name: string;
    path: string;
    langs: string[];
    versions: IVersionMetaData[];
    categories: ICategory[];
    keywords: IKeyword[];    
}