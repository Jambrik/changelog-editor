import { I18n } from './I18N';
import { Tag } from './Tag';

export interface ChangeLogItem {
    id: string;
    date: Date;
    ticketNumber?: string;
    type: 'bugfix' | 'feature';
    importance: 'low' | 'normal' | 'high';
    descriptions: I18n[];
    tags: Tag[];
    cru?: string;
    crd?: Date;
    lmu?: string;
    lmd?: Date;
}
