import { I18n } from './I18N';
import { ITag } from './ITag';

export interface IChangeLogItem {
    id: string;
    date: Date;
    ticketNumber?: string;
    type: 'bugfix' | 'feature';
    importance: 'low' | 'normal' | 'high';
    descriptions: I18n[];
    tags: ITag[];
    cru?: string;
    crd?: Date;
    lmu?: string;
    lmd?: Date;
}
