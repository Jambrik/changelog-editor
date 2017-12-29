import { IName } from "./IName";
import { ISubCategory } from "./ISubCategory";

export interface ICategory extends ISubCategory {    
    subCategoies: ISubCategory[];
}