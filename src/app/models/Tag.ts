import { ITag } from "./ITag";
import { TranslateService } from "@ngx-translate/core";
import { TagInfo } from "./TagInfo";
import { ICodeCaption } from "./ICodeCaption";

export class Tag implements ITag {
    private _compactValues: ICodeCaption[] = [];
    public code: string;
    constructor(
        public tagInfo: TagInfo,
        public values: string[]
    ) {
        this.code = tagInfo.code;

    }

    public get compactValues(): ICodeCaption[] {
        this._compactValues.length = 0;
        for (let value of this.values) {
            for (let compactValue of this.tagInfo.valuesCompact) {
                if (compactValue.code == value) {
                    this._compactValues.push(compactValue);
                }
            }
        }
        return this._compactValues;
    }

    public set compactValues(compactValues: ICodeCaption[]) {
        let values: string[] = [];
        for (let compactValue of compactValues) {
            values.push(compactValue.code)
        }
        this.values = values;
    }
}