import { I18n } from '../models/I18N';

export class ListHelper {
    public static getCurrentCaption(captions: I18n[], lang: string): string {
        let result: string;
        for (const c of captions) {
            if (c.lang === lang) {
                result = c.text;
            }
        }
        return result;
    }
}
