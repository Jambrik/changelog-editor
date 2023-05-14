import { ChangeLogItem } from './ChangeLogItem';
import { VersionMetaData } from './VersionMetaData';

export interface VersionChangeLog extends VersionMetaData {
    changes: ChangeLogItem[];
}
