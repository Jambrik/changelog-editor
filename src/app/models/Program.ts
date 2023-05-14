import { ITagInfo } from './ITagInfo';
import { IVersionMetaData } from './IVersionMetaData';

export interface Program {
    id: number;
    name: string;
    path: string;
    langs: string[];
    tagInfos: ITagInfo[];
    versions: IVersionMetaData[];
}
