import { ICategory } from "./ICategory";
import { IKeyword } from "./IKeyword";

export interface IProgram {
    id: number;
    name: string;
    path: string;
    langs: string[];
    versions: string[];
    categories: ICategory[];
    keywords: IKeyword[];
}