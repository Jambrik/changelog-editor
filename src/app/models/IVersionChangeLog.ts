import { IChangeLogItem } from './IChangeLogItem';
import { IVersionMetaData } from './IVersionMetaData';

export interface IVersionChangeLog extends IVersionMetaData {
    changes: IChangeLogItem[];
}
