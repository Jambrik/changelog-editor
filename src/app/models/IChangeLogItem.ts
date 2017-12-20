import { IDescription } from "./IDescription";

export interface IChangeLogItem {
    id: number,
    date: Date;    
    ticketNumber?: string;
    type: "bugfix" | "feature";
    descriptions: IDescription[];
    category?: string;
    subCategory?: string;
    keywords: string[];
}