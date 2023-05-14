import { IVersionMetaData } from './IVersionMetaData';
import { TagInfo } from './TagInfo';

export interface Program {
    id: number;
    name: string;
    path: string;
    langs: string[];
    tagInfos: TagInfo[];
    versions: IVersionMetaData[];
}
