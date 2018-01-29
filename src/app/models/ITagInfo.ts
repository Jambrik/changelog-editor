import { I18n } from "./I18N";
import { ICodeCaptions } from "./ICodeCaptions";

export interface ITagInfo extends ICodeCaptions{    
    fix: boolean;
    moreOptionsAllowed: boolean;
    setOfValues: ICodeCaptions[];
}