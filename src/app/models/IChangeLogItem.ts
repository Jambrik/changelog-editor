import { I18n } from "./I18N";

export interface IChangeLogItem {
    id: string;
    date: Date;    
    ticketNumber?: string;
    type: "bugfix" | "feature";
    descriptions: I18n[];
    category?: string;
    subCategory?: string;
    keywords: string[];
    cru?: string;
    crd?: Date;
    lmu?: string;
    lmd?: Date;
}