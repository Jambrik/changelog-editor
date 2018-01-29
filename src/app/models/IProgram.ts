import { IVersionMetaData } from "./IVersionMetaData";
import { ITagInfo } from "./ITagInfo";

export interface IProgram {
    id: number;
    name: string;
    path: string;
    langs: string[];
    tagInfos: ITagInfo[];
    versions: IVersionMetaData[];
    
}