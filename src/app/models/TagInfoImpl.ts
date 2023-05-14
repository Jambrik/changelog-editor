import { TranslateService } from '@ngx-translate/core';
import { ListHelper } from '../helpers/list-helper';
import { CodeCaption } from './CodeCaption';
import { CodeCaptions } from './CodeCaptions';
import { I18n } from './I18N';
import { TagInfo } from './TagInfo';

export class TagInfoImpl implements TagInfo {

    constructor(
        public code: string,
        public captions: I18n[],
        public fix: boolean,
        public moreOptionsAllowed: boolean,
        public mandatory: boolean,
        public dataType: 'string' | 'number' | 'boolean',
        public setOfValues: CodeCaptions[],
        public translateService: TranslateService
    ) {

    }

    public get caption(): string {
        return ListHelper.getCurrentCaption(this.captions, this.translateService.currentLang);
    }

    public get valuesCompact(): CodeCaption[] {
        const result: CodeCaption[] = [];
        if (this.setOfValues) {
            for (const v of this.setOfValues) {
                const r: CodeCaption = {
                    code: v.code,
                    caption: ListHelper.getCurrentCaption(v.captions, this.translateService.currentLang)
                };

                result.push(r);
            }
        }
        return result;
    }

}
