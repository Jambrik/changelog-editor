import { ITagInfo } from './ITagInfo';
import { I18n } from './I18N';
import { ICodeCaptions } from './ICodeCaptions';
import { TranslateService } from '@ngx-translate/core';
import { ICodeCaption } from './ICodeCaption';
import { ListHelper } from '../helpers/list-helper';

export class TagInfo implements ITagInfo {

    constructor(
        public code: string,
        public captions: I18n[],
        public fix: boolean,
        public moreOptionsAllowed: boolean,
        public mandatory: boolean,
        public dataType: 'string' | 'number' | 'boolean',
        public setOfValues: ICodeCaptions[],
        public translateService: TranslateService
    ) {

    }

    public get caption(): string {
        return ListHelper.getCurrentCaption(this.captions, this.translateService.currentLang);
    }

    public get valuesCompact(): ICodeCaption[] {
        const result: ICodeCaption[] = [];
        if (this.setOfValues) {
            for (const v of this.setOfValues) {
                const r: ICodeCaption = {
                    code: v.code,
                    caption: ListHelper.getCurrentCaption(v.captions, this.translateService.currentLang)
                };

                result.push(r);
            }
        }
        return result;
    }

}
