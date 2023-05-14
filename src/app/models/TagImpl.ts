import { ICodeCaption } from './ICodeCaption';
import { ITag } from './ITag';
import { TagInfoImpl } from './TagInfo';

export class TagImpl implements ITag {
    private _compactValues: ICodeCaption[] = [];
    public code: string;
    constructor(
        public tagInfo: TagInfoImpl,
        public values?: string[],
        public value?: boolean | string | number
    ) {
        this.code = tagInfo.code;

    }

    public get compactValues(): ICodeCaption[] {
        this._compactValues.length = 0;
        for (const value of this.values) {
            for (const compactValue of this.tagInfo.valuesCompact) {
                if (compactValue.code === value) {
                    this._compactValues.push(compactValue);
                }
            }
        }
        return this._compactValues;
    }

    public set compactValues(compactValues: ICodeCaption[]) {
        const values: string[] = [];
        for (const compactValue of compactValues) {
            values.push(compactValue.code);
        }
        this.values = values;
    }
}
