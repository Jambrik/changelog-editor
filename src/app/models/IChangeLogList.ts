import { IChangeLogItem } from "./IChangeLogItem";

export interface IChaneLogList {
    version: string;
    releaseDate?: Date;
    changes: IChangeLogItem[];
}