import { ChangeLogItem } from './ChangeLogItem';
import { IVersionMetaData } from './IVersionMetaData';

export interface IVersionChangeLog extends IVersionMetaData {
    changes: ChangeLogItem[];
}
