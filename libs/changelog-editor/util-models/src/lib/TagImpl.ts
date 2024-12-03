import { CodeCaption } from './CodeCaption';
import { Tag } from './Tag';
import { TagInfoImpl } from './TagInfoImpl';

export class TagImpl implements Tag {
    private _compactValues: CodeCaption[] = [];
    public code: string;
    constructor(
        public tagInfo: TagInfoImpl,
        public values?: string[],
        public value?: boolean | string | number
    ) {
        this.code = tagInfo.code;

    }

    public get compactValues(): CodeCaption[] {
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

    public set compactValues(compactValues: CodeCaption[]) {
        const values: string[] = [];
        for (const compactValue of compactValues) {
            values.push(compactValue.code);
        }
        this.values = values;
    }
}
