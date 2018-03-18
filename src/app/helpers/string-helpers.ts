import { IBoolString } from "../models/IBoolString";

export class StringHelpers {
    public static sortAsc(a: any, b: any) {
        if (a < b) {
            return -1;
        } else if (a == b) {
            return 0;
        } else {
            return 1;
        }
    }

    public static sortDesc(a: any, b: any) {
        if (a < b) {
            return 1;
        } else if (a == b) {
            return 0;
        } else {
            return -1;
        }
    }

    public static findAndGreen(text: string, part: string, green: boolean): IBoolString {
        let index = text.toUpperCase().indexOf(part.toUpperCase());        
        if (green && (index > -1)) {
            text = text.replace(text.substring(index, index + part.length),
                "<span style='background-color: chartreuse; font-weight: 600;'>" + text.substring(index, index + part.length) + "</span>");
        }
        return {
            bool: index > -1,
            str: text
        };
    }
}