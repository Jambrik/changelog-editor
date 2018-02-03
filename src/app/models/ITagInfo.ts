import { I18n } from "./I18N";
import { ICodeCaptions } from "./ICodeCaptions";

/**
 * Supported combinations:
 * dataType string, setOfValues are defined
 */
export interface ITagInfo extends ICodeCaptions{    
    fix: boolean;
    moreOptionsAllowed: boolean;
    mandatory: boolean;
    dataType: "string" | "number" | "boolean"
    setOfValues: ICodeCaptions[];
}