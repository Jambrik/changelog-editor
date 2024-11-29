import { TagInfo } from './TagInfo';
import { VersionMetaData } from './VersionMetaData';

export interface Program {
    id: number;
    name: string;
    path: string;
    langs: string[];
    tagInfos: TagInfo[];
    versions: VersionMetaData[];
}
