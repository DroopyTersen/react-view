import * as t from '@babel/types';
import { TProp } from './types';
export declare const parse: (code: string) => t.File;
export declare const transformBeforeCompilation: (ast: t.File, elementName: string, propsConfig: {
    [key: string]: TProp<any>;
}) => t.File;
export declare function parseCode(code: string, elementName: string, parseProvider?: (ast: any) => void): {
    parsedProps: {
        [key: string]: string;
    };
    parsedProvider: any;
};
