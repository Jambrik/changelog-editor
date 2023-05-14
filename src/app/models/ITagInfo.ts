import { CodeCaptions } from './CodeCaptions';

/**
 * Supported combinations:
 * dataType string, setOfValues are defined
 */
export interface ITagInfo extends CodeCaptions {
    fix: boolean;
    moreOptionsAllowed: boolean;
    mandatory: boolean;
    dataType: 'string' | 'number' | 'boolean';
    setOfValues: CodeCaptions[];
}
